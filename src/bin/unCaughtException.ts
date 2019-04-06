

// handle uncaught exception
process.on('uncaughtException', async error => {
  // tslint:disable-next-line:no-console
  console.log('########################################\n');
  // tslint:disable-next-line:no-console
  console.log(error);
  // tslint:disable-next-line:no-console
  console.trace(error);
  // tslint:disable-next-line:no-console
  console.log('\n########################################\n');
  
});
