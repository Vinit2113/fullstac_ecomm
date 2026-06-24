const logotuAuth = async (req, res) => {
  try {
    const userId = req.user.id;

    


  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
