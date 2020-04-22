import nextConnect from "next-connect";
import middleware from "../../../middleware/middleware";

const handler = nextConnect();
const loanDBName = process.env.LOAN_COLLECTION_NAME;

handler.use(middleware);

// GET /api/loan
handler.get(async (req, res) => {
  if (req.isAuthenticated()) {
    await req.db
      .collection(loanDBName)
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized." });
  }
});

// POST /api/loan
handler.post(async (req, res) => {
  if (req.isAuthenticated()) {
    const req_body = req.body;
    req_body.date = new Date();
    await req.db
      .collection(loanDBName)
      .insertOne(req_body, function (err, res) {
        if (err) throw err;
      });
    res.json({ message: "OK." });
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized." });
  }
});

export default handler;
