const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful. Cookie cleared.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while logging out.'
    });
  }
});

module.exports = router;
