import rateLimit from "express-rate-limit";

// rate limiter for contact form
const contactLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    limit : 15,
    message:
    {
        success:false,
        message:" Too many request , please try again later"
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
});

export {contactLimiter}