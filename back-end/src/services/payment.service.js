const prisma = require("../utils/prisma");

class PaymentService {
  static MIN_FIRST_PAYMENT_PERCENTAGE = 20;
  static MIN_PAYMENT_AMOUNT = 1000;
  static MAX_PAYMENT_AMOUNT = 10000000;

  /**
   * Validates payment plan on the server side
   */
  static validatePaymentPlan(payments, propertyPrice) {
    if (!payments || payments.length === 0) {
      throw new Error("At least one payment is required");
    }

    if (!propertyPrice || propertyPrice <= 0) {
      throw new Error("Property price must be greater than zero");
    }

    // Sort payments by due date
    const sortedPayments = [...payments].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );

    const firstPayment = sortedPayments[0];
    
    // Validate first payment
    this.validateFirstPayment(firstPayment.amount, propertyPrice);

    // Validate total payments
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    if (totalPayments > propertyPrice) {
      throw new Error(`Total payments (${totalPayments.toLocaleString()} MAD) cannot exceed property price (${propertyPrice.toLocaleString()} MAD)`);
    }

    return true;
  }

  /**
   * Validates first payment amount
   */
  static validateFirstPayment(amount, propertyPrice) {
    if (!amount || amount <= 0) {
      throw new Error("First payment amount must be greater than zero");
    }

    if (amount > propertyPrice) {
      throw new Error("First payment cannot exceed the total property price");
    }

    const percentage = (amount / propertyPrice) * 100;

    if (percentage < this.MIN_FIRST_PAYMENT_PERCENTAGE) {
      const suggestedAmount = Math.max(
        propertyPrice * (this.MIN_FIRST_PAYMENT_PERCENTAGE / 100),
        this.MIN_PAYMENT_AMOUNT
      );
      throw new Error(`First payment must be at least ${this.MIN_FIRST_PAYMENT_PERCENTAGE}% of the property price (${Math.round(suggestedAmount)} MAD)`);
    }

    if (amount < this.MIN_PAYMENT_AMOUNT) {
      throw new Error(`First payment must be at least ${this.MIN_PAYMENT_AMOUNT.toLocaleString()} MAD`);
    }

    if (amount > this.MAX_PAYMENT_AMOUNT) {
      throw new Error(`First payment cannot exceed ${this.MAX_PAYMENT_AMOUNT.toLocaleString()} MAD`);
    }

    return true;
  }

  /**
   * Creates payment records in the database
   */
  static async createPayments(payments, propertyId, contractId = null) {
    const paymentRecords = payments.map(payment => ({
      amount: payment.amount,
      dueDate: new Date(payment.dueDate),
      status: "PENDING",
      propertyId: propertyId,
      contractId: contractId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return await prisma.payment.createMany({
      data: paymentRecords
    });
  }
}

module.exports = PaymentService; 