/* Create a local collection (client-only) that will not synchronize with the
 * server by setting the MongoDB collection name to `null`.
 */
Errors = new Mongo.Collection(null);

/* Add errors to the local errors collection.
 */
throwError = function(message) {
  Errors.insert({message: message});
}