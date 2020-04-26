const SERVICE_NAME = "BID-Cluster";
const DB_NAME = "Loan";
const LOAN_COLLECTION_NAME = "loans";
const NOTI_COLLECTION_NAME = "notifications";
const USER_COLLECTION_NAME = "users";
const INCREASE_DAY = 3;

/**
 * This is to generate notifications according to schedule.
 */
exports = async function scheduleTaskToGenerateNoti() {
  const loanCollection = context.services
    .get(SERVICE_NAME)
    .db(DB_NAME)
    .collection(LOAN_COLLECTION_NAME);

  const today = new Date();
  today.setDate(today.getDate());
  const day = today.getDate() - INCREASE_DAY;
  const mth = today.getMonth() + 1;
  const year = today.getFullYear();

  let strDate = "";
  if (mth < 10) {
    if (day < 10) {
      strDate = `0${day}/0${mth}/${year}`;
    } else {
      strDate = `${day}/0${mth}/${year}`;
    }
  } else {
    if (day < 10) {
      strDate = `0${day}/${mth}/${year}`;
    } else {
      strDate = `${day}/${mth}/${year}`;
    }
  }
  const loanList = await loanCollection
    .find({
      installmentRecords: {
        $elemMatch: {
          dueDate: strDate,
          isPaid: false,
        },
      },
    })
    .toArray();
  if (loanList.length) {
    const userCollection = context.services
      .get(SERVICE_NAME)
      .db(DB_NAME)
      .collection(USER_COLLECTION_NAME);
    const userList = await userCollection
      .find(
        {},
        {
          _id: 0,
          name: 1,
        }
      )
      .toArray();
    const notiCollection = context.services
      .get(SERVICE_NAME)
      .db(DB_NAME)
      .collection(NOTI_COLLECTION_NAME);
    let notiObj = {};
    loanList.forEach((element) => {
      notiObj = {};
      notiObj["subject"] = "Reminder for Loan";
      notiObj[
        "description"
      ] = `The coming ${strDate} is payday of ${element.borrowerInfo.borrower}.`;
      notiObj["uri"] =`/loan/${element._id}`;
      notiObj["to_read"] = userList;
      notiObj["read"] = [];
    });

    notiCollection.insertOne(notiObj, function (err, res) {
      if (err) throw err;
    });
  }
}