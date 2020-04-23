import nextConnect from "next-connect";
import middleware from "../../../middleware/middleware";
import { ObjectId } from "mongodb";

const loanDBName = process.env.LOAN_COLLECTION_NAME;
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const {
    query: { loanId },
  } = req;
  if (req.isAuthenticated()) {
    await req.db
      .collection(loanDBName)
      .find({ _id: ObjectId(loanId) })
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      });
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized." });
  }
});

handler.put(async (req, res) => {
  const {
    query: { loanId },
  } = req;
  const { date, isPaid } = req.body;
  if (req.isAuthenticated()) {
    const matchQuery = {
      _id: ObjectId(loanId),
      "installmentRecords.dueDate": date,
    };
    const newValues = {
      $set: { "installmentRecords.$.isPaid": isPaid, date: new Date() },
    };
    await req.db
      .collection(loanDBName)
      .update(matchQuery, newValues, function (err, result) {
        if (err) throw err;
        res.json({ message: "OK" });
      });
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized." });
  }
});

export default handler;
