let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
    // reject("Something went wrong");
  }, 2000);
});
let a = 5;
promise.then((result) => {
  console.log(result); // logs "Success!" after 2 seconds
}).catch((error) => {
  console.error(error);
});

console.log(a);