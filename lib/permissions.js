/* Previously, by removing the `insecure` package, all client-side modifications
 * are being denied. To fix this, set up the permissions rules and make sure
 * our permissions logic loads first and is available in both client and server.
 */
 ownsDocument = function(userId, doc) {
   // Check that the userId specified owns the documents
   return doc && doc.userId === userId;
 }