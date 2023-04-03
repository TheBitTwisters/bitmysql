class DbError extends Error {
  constructor(error) {
    super(error.message || 'Unidentified database error');

    this.data = { error };
    this.statusCode = error.statusCode || 500;

    let isDebugging = process.env.DATABASE_DEBUGGING || false;
    if (isDebugging) {
      console.error(error.message);
    }
  }
}

class DbSearchError extends DbError {
  constructor(error) {
    super('Error in database searching method');

    this.data = { error };
    this.statusCode = 521;
  }
}

class DbSelectError extends DbError {
  constructor(error) {
    super('Error in database select');

    this.data = { error };
    this.statusCode = 522;
  }
}

class DbInsertError extends DbError {
  constructor(error) {
    super('Error in database insert');

    this.data = { error };
    this.statusCode = 523;
  }
}

class DbUpdateError extends DbError {
  constructor(error) {
    super('Error in database update');

    this.data = { error };
    this.statusCode = 524;
  }
}

class DbDeleteError extends DbError {
  constructor(error) {
    super('Error in database delete');

    this.data = { error };
    this.statusCode = 525;
  }
}

module.exports.DbError = DbError;
module.exports.DbSearchError = DbSearchError;
module.exports.DbSelectError = DbSelectError;
module.exports.DbInsertError = DbInsertError;
module.exports.DbUpdateError = DbUpdateError;
module.exports.DbDeleteError = DbDeleteError;
