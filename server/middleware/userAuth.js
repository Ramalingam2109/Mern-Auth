import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized, Login Again' })
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

    if (tokenDecode.id) {
      // Set userId on req object (not req.body)
      req.userId = tokenDecode.id
    } else {
      return res.json({ success: false, message: 'Not Authorized, Login Again' })
    }
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export default userAuth
