export default getData() {
    axios.get('/user?ID=12345')
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }