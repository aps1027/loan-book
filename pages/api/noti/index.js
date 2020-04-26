import nextConnect from "next-connect";
import middleware from "../../../middleware/middleware";
import { ObjectId } from "mongodb";

const handler = nextConnect();
const notiDBName = process.env.NOTI_COLLECTION_NAME;

handler.use(middleware);

// GET /api/noti
handler.get(async (req, res) => {
  if (req.isAuthenticated()) {
    await req.db
      .collection(notiDBName)
      .find({
        to_read: {
          $elemMatch: {
            name: req.user.name,
          },
        },
      })
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized." });
  }
});

handler.put(async (req, res) => {
  const { notiId } = req.body;
  if (req.isAuthenticated()) {
    const matchQuery = {
      _id: ObjectId(notiId),
    };
    const newValues = {
      $push: { read: { name: req.user.name } },
    };
    await req.db
      .collection(notiDBName)
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
