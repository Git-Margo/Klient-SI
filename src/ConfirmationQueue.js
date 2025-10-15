class ConfirmationQueue {
  conditions = []

  addCondition(condition, message, confirmType) {
    this.conditions.push({ condition, message, confirmType });
    return this;
  }

  processConditions(callback) {
    this.processCondition(0, callback);
  }

  processCondition(index, callback) {
    if (index < this.conditions.length) {
      const { condition, message, confirmType = 1 } = this.conditions[index];
      if (condition()) {
        mAlert(message, confirmType, [
          () => this.processCondition(index + 1, callback),
          () => {}
        ]);
      } else {
        this.processCondition(index + 1, callback);
      }
    } else {
      callback();
    }
  }
}
