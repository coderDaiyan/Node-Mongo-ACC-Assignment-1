const fs = require("fs");
const { dirname } = require("path");
const appDir = dirname(require.main.filename);

const getRandomUser = (req, res) => {
  fs.readFile(`${appDir}/data.json`, "utf-8", (err, data) => {
    if (err) res.status(500).send("Something went wrong");
    else {
      const parsedUsers = JSON.parse(data.toString());
      const randomDigit = Math.round(Math.random() * (parsedUsers.length - 1));
      res.status(200).json(parsedUsers[randomDigit]);
    }
  });
};

const getAllUsers = (req, res) => {
  fs.readFile(`${appDir}/data.json`, "utf-8", (err, data) => {
    if (err) res.status(500).send("Something went wrong");
    else {
      const parsedUsers = JSON.parse(data.toString());
      if (req.query.limit) {
        if (req.query.limit > parsedUsers.length) {
          res.status(200).json([]);
        } else {
          res.status(200).json(parsedUsers.slice(0, req.query.limit));
        }
      } else {
        res.status(200).json(parsedUsers);
      }
    }
  });
};

const saveAUser = (req, res) => {
  const { id, gender, name, contact, address, photoUrl } = req.body;

  if (id && gender && name && contact && address && photoUrl) {
    fs.readFile(`${appDir}/data.json`, "utf-8", (err, data) => {
      if (err) res.status(500).send("Something went wrong");
      else {
        const parsedUsers = JSON.parse(data.toString());
        const newUsers = [...parsedUsers, req.body];
        fs.writeFile(
          `${appDir}/data.json`,
          JSON.stringify(newUsers),
          { encoding: "utf-8" },
          (err) => {
            if (err) res.status(500).send("Something went wrong");
            else res.status(200).json(newUsers);
          }
        );
      }
    });
  } else {
    res.status(400).send("Please give all the required fields!");
  }
};

const deleteAUser = (req, res) => {
  if (req.params.id) {
    fs.readFile(`${appDir}/data.json`, "utf-8", (err, data) => {
      if (err) res.status(500).send("Something went wrong");
      else {
        const parsedUsers = JSON.parse(data.toString());
        const indexOfUser = parsedUsers.findIndex(
          (user) => user.id == req.params.id
        );
        if (indexOfUser === -1) {
          res.status(400).send("User not found");
        } else {
          parsedUsers.splice(indexOfUser, 1);
          fs.writeFile(
            `${appDir}/data.json`,
            JSON.stringify(parsedUsers),
            { encoding: "utf-8" },
            (err) => {
              if (err) res.status(500).send("Something went wrong");
              else res.status(200).json(parsedUsers);
            }
          );
        }
      }
    });
  } else {
    res.status(400).send("Please give a valid ID");
  }
};

const updateAUser = (req, res) => {
  if (req.params.id) {
    const { gender, name, contact, address, photoUrl } = req.body;

    if (gender || name || contact || address || photoUrl) {
      fs.readFile(`${appDir}/data.json`, "utf-8", (err, data) => {
        if (err) res.status(500).send("Something went wrong");
        else {
          const parsedUsers = JSON.parse(data.toString());
          const indexOfUser = parsedUsers.findIndex(
            (user) => user.id == req.params.id
          );
          if (indexOfUser === -1) {
            res.status(400).send("User not found");
          } else {
            parsedUsers.splice(indexOfUser, 1, {
              ...parsedUsers[indexOfUser],
              ...req.body,
            });
            fs.writeFile(
              `${appDir}/data.json`,
              JSON.stringify(parsedUsers),
              { encoding: "utf-8" },
              (err) => {
                if (err) res.status(500).send("Something went wrong");
                else res.status(200).json(parsedUsers);
              }
            );
          }
        }
      });
    } else {
      res.status(400).send("Please give atleast one field");
    }
  } else {
    res.status(400).send("Please give a valid ID");
  }
};

const bulkUpdateUsers = (req, res) => {
  const ids = req.query.ids.split(",").map(function (item) {
    return item.trim();
  });

  ids.map((id) => {
    if (id) {
      const selectedUserData = req.body.find((elm) => elm.id == id);
      const { gender, name, contact, address, photoUrl } = selectedUserData;
      if (gender || name || contact || address || photoUrl) {
        fs.readFile(`${appDir}/data.json`, "utf-8", (err, data) => {
          const parsedUsers = JSON.parse(data.toString());
          if (err) res.status(500).send("Something went wrong");
          else {
            const indexOfUser = parsedUsers.findIndex((user) => user.id == id);
            if (indexOfUser === -1) {
              res.status(400).send("User not found");
            } else {
              parsedUsers.splice(indexOfUser, 1, {
                ...parsedUsers[indexOfUser],
                ...selectedUserData,
              });
              fs.writeFile(
                `${appDir}/data.json`,
                JSON.stringify(parsedUsers),
                {
                  encoding: "utf-8",
                },
                (err) => {
                  if (!err) {
                  }
                }
              );
            }
          }
        });
      } else {
        res.status(400).send("Please give atleast one field");
      }
    } else {
      res.status(400).send("Please give a Valid ID");
    }
  });

  res.send("Updated");
};

module.exports = {
  getRandomUser,
  getAllUsers,
  saveAUser,
  deleteAUser,
  updateAUser,
  bulkUpdateUsers,
};
