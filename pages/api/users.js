import nextConnect from "next-connect";
import isEmail from "validator/lib/isEmail";
import normalizeEmail from "validator/lib/normalizeEmail";
import bcrypt from "bcryptjs";
import middleware from "../../middleware/middleware";
import { extractUser } from "../../lib/api-helpers";

const handler = nextConnect();
const userDBName = process.env.USER_COLLECTION_NAME;
handler.use(middleware); // see how we're reusing our middleware

// POST /api/users
handler.post(async (req, res) => {
  if (req.isAuthenticated()) {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email); // this is to handle things like jane.doe@gmail.com and janedoe@gmail.com being the same
    if (!isEmail(email)) {
      res.status(400).send("The email you entered is invalid.");
      return;
    }
    if (!password || !name) {
      res.status(400).send("Missing field(s)");
      return;
    }
    // check if email existed
    if ((await req.db.collection(userDBName).countDocuments({ email })) > 0) {
      res.status(403).send("The email has already been used.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await req.db
      .collection(userDBName)
      .insertOne({ email, password: hashedPassword, name }, function (
        err,
        res
      ) {
        if (err) throw err;
      });
    res.json({ message: "OK." });
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized." });
  }
});

// GET /api/users
handler.get(async (req, res) => {
  if (req.isAuthenticated()) {
    await req.db
      .collection(userDBName)
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        result.forEach((element) => {
          delete element.password;
        });
        res.json(result);
      });
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized." });
  }
});

export default handler;
