export  const isDelivery =
(
  req,
  res,
  next
) => {

  if (
    req.user.role !==
    "delivery"
  ) {

    return res.status(403).json({
      success: false,
      message:
        "Access denied",
      data: null,
    });

  }

  next();
};