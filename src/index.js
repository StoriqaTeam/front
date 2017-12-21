const fetchUser = () => Promise.resolve(`John`);
const fetchItem = user => Promise.resolve(`${user} has ice cream`);

function logItems() {
  Promise.resolve()
    .then(fetchUser)
    .then(
      user =>
        new Promise((resolve, reject) => {
          Promise.resolve(fetchItem(user))
            .then(item => resolve([user, item]))
            .catch(reject);
        })
    )
    .then(([user, item]) => consoleё.log(`${user} has ${item}`))
    .catch(error => console.error(error));
}

logItems();