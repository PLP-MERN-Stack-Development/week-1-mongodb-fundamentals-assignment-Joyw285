// Create the 'plp_bookstore' database and 'books' collection using MongoDB Shell
// Save this as create_database.js 

// Switch to or create the database
db = db.getSiblingDB('plp_bookstore');

// Create the 'books' collection (MongoDB will auto-create it when data is inserted)
db.createCollection('books');

// Optional: Confirm creation
db.getCollectionNames();

// queries.js

// Task 2: Basic CRUD Queries

// 1. Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year (e.g., 2000)
db.books.find({ published_year: { $gt: 2000 } });

// 3. Find books by a specific author (e.g., George Orwell)
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book (e.g., "1984")
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 12.49 } }
);

// 5. Delete a book by its title (e.g., "Animal Farm")
db.books.deleteOne({ title: "Animal Farm" });


// Task 3: Advanced Queries

// 1. Find books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 2. Projection: return only title, author, and price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// 3. Sorting by price ascending
db.books.find().sort({ price: 1 });

// 4. Sorting by price descending
db.books.find().sort({ price: -1 });

// 5. Pagination - Page 1 (5 books per page)
db.books.find().skip(0).limit(5);

// 6. Pagination - Page 2 (next 5 books)
db.books.find().skip(5).limit(5);


// Task 4: Aggregation Pipeline

// 1. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", average_price: { $avg: "$price" } } }
]);

// 2. Find the author with the most books
db.books.aggregate([
  { $group: { _id: "$author", book_count: { $sum: 1 } } },
  { $sort: { book_count: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: [ { $toString: "$published_year" }, 0, 3 ] },
          "0s"
        ]
      }
    }
  },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);


// Task 5: Indexing

// 1. Create an index on the title field
db.books.createIndex({ title: 1 });

// 2. Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 3. Use explain() to show performance improvement
// Without index (run before creating indexes)
db.books.find({ title: "1984" }).explain("executionStats");

// With compound index (after creating indexes)
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");
