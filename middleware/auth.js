import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in either Authorization header or custom token header
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing. Please login again."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user ID to request
    req.user = { 
      id: decoded.id,
      // Add other relevant user data if needed
    };
    
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    
    let message = "Authentication failed";
    if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    } else if (error.name === "TokenExpiredError") {
      message = "Token expired. Please login again.";
    }

    return res.status(401).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export default authMiddleware;