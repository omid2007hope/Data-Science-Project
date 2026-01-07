/** @format */
// File header used by some tooling to enforce formatting.

class BaseService {
  // Define a base service class to share common CRUD logic.
  constructor(model) {
    // Store the Mongoose model instance for later queries.
    this.model = model;
  }

  // Build a reusable "not deleted" filter merged with any extra conditions.
  _active = (condition = {}) => ({ ...condition, isDeleted: { $ne: true } });

  // Build a recursive tree of documents based on a parent reference field.
  _buildTree = async (nodes, parentField) =>
    // Run child lookups for all nodes in parallel.
    Promise.all(
      nodes.map(async (node) => {
        // Query children of the current node and filter out soft-deleted docs.
        const children = await this.model.find(
          this._active({ [parentField]: node._id })
        );

        // Return the node as a plain object with a "child" array attached.
        return {
          ...node.toObject(),
          child: children.length
            ? await this._buildTree(children, parentField)
            : [],
        };
      })
    );

  // Find all active documents that match a condition.
  findAll = async (condition = {}) => this.model.find(this._active(condition));

  // Find all active documents and apply a sort object.
  findAllWithSort = async (condition = {}, sort = {}) =>
    this.model.find(this._active(condition)).sort(sort);

  // Find all root nodes and build a full recursive tree by parent field.
  findAllRecursive = async (parentField) => {
    // Roots are documents with a null parent and not deleted.
    const parent = await this.model.find(this._active({ [parentField]: null }));

    // Build and return the full tree from the roots.
    return this._buildTree(parent, parentField);
  };

  // Find matching roots and build a recursive tree from those results.
  findAllRecursiveByCondition = async (condition, parentField) => {
    try {
      // Load the starting nodes using the active filter.
      const parent = await this.model.find(this._active(condition));
      // Build and return the tree from those nodes.
      return this._buildTree(parent, parentField);
    } catch (err) {
      // Log the error for debugging if the query fails.
      console.error(err);
      // Return null to indicate failure to the caller.
      return null;
    }
  };

  // Find all soft-deleted documents.
  findAllDeleted = async () => this.model.find({ isDeleted: true });

  // Find active documents and slice the results for pagination.
  findAllWithPagination = async (condition, { page = 1, limit = 10, sort }) => {
    // Query the filtered list and apply sorting.
    const data = await this.model.find(this._active(condition)).sort(sort);

    // Compute total records and total pages.
    const total = data.length;
    const pages = Math.ceil(total / limit);

    // Return the page slice and pagination metadata.
    return {
      data: data.slice((page - 1) * limit, page * limit),
      metaData: { pages, total, currentPage: page },
    };
  };

  // Find active documents and populate referenced fields.
  findAllAndPopulate = async (condition, populate) =>
    this.model.find(this._active(condition)).populate(populate);

  // Find a single document by MongoDB id.
  findById = async (id) => this.model.findById(id);

  // Find a document by id and populate referenced fields.
  findByIdPopulate = async (id, populate) =>
    this.model.findById(id).populate(populate);

  // Find one active document that matches a condition.
  findOneByCondition = async (condition) =>
    this.model.findOne(this._active(condition));

  // Find one active document and populate referenced fields.
  findOneByConditionAndPopulate = async (condition, populate) =>
    this.model.findOne(this._active(condition)).populate(populate);

  // Hard-delete a single document (removes from DB).
  hardDelete = async (condition) => this.model.findOneAndDelete(condition);

  // Soft-delete a document by flipping the isDeleted flag and tracking user.
  softDelete = async (condition, user) =>
    this.model.findOneAndUpdate(
      condition,
      { isDeleted: true, deletedBy: user },
      { new: true }
    );

  // Soft-delete a document and all of its descendants recursively.
  softDeleteRecursive = async (parentField, condition, user) => {
    try {
      // Soft-delete the root document first.
      const parent = await this.model.findOneAndUpdate(
        condition,
        { isDeleted: true, deletedBy: user },
        { new: true }
      );

      // Define a helper to recursively soft-delete children.
      const getChildren = async (parentId) => {
        // Load direct children for the current parent id.
        const children = await this.model.find({ [parentField]: parentId });

        // Soft-delete each child and recurse deeper.
        return Promise.all(
          children.map(async (child) => {
            await this.model.findByIdAndUpdate(child._id, {
              isDeleted: true,
              deletedBy: user,
            });

            // Return the child with its nested children.
            return {
              ...child.toObject(),
              child: await getChildren(child._id),
            };
          })
        );
      };

      // Start recursion from the root document id.
      return getChildren(parent._id);
    } catch (err) {
      // Log the error for debugging if the recursive delete fails.
      console.error(err);
      // Return null to indicate failure to the caller.
      return null;
    }
  };

  // Hard-delete many documents at once.
  hardDeleteMany = async (condition) => this.model.deleteMany(condition);

  // Update a single document and optionally return the updated version.
  update = async (condition, data, returnNew = true) =>
    this.model.findOneAndUpdate(condition, data, { new: returnNew });

  // Soft-delete a document and then create a new replacement document.
  updateBySoftDelete = async (condition, data, req) => {
    // Mark the old document as deleted and record the admin name.
    await this.model.findOneAndUpdate(condition, {
      isDeleted: true,
      deletedBy: req.admin?.userName,
    });

    // Create and return a new document using the provided data.
    return this.createObject(data);
  };

  // Update multiple documents at once.
  updateAll = async (condition, data) => this.model.updateMany(condition, data);

  // Restore a soft-deleted document to active state.
  restoreSoftDelete = async (condition) =>
    this.model.findOneAndUpdate(
      condition,
      { isDeleted: false, deletedBy: "" },
      { new: true }
    );

  // Create a new document instance and save it.
  createObject = async (data) => {
    // Construct the model instance with incoming data.
    const obj = new this.model(data);
    // Save the document to the database and return the result.
    return obj.save();
  };
}

// Export the class for use in other modules.
module.exports = BaseService;
