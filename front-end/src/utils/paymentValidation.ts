export interface PaymentValidationResult {
  isValid: boolean;
  error?: string;
  suggestedAmount?: number;
  percentage?: number;
}

export interface PaymentPlan {
  payments: Array<{
    amount: number;
    dueDate: Date;
    isFirstPayment: boolean;
  }>;
  totalAmount: number;
  firstPaymentAmount: number;
  firstPaymentPercentage: number;
}

export class PaymentValidator {
  private static readonly MIN_FIRST_PAYMENT_PERCENTAGE = 20; // 20%
  private static readonly MAX_FIRST_PAYMENT_PERCENTAGE = 100; // 100%
  private static readonly MIN_PAYMENT_AMOUNT = 1000; // Minimum 1000 MAD
  private static readonly MAX_PAYMENT_AMOUNT = 10000000; // Maximum 10M MAD

  /**
   * Validates if the first payment meets the minimum 20% requirement
   */
  static validateFirstPayment(
    firstPaymentAmount: number,
    totalPropertyPrice: number
  ): PaymentValidationResult {
    // Edge case: Zero or negative property price
    if (!totalPropertyPrice || totalPropertyPrice <= 0) {
      return {
        isValid: false,
        error: "Property price must be greater than zero",
        suggestedAmount: 0,
        percentage: 0
      };
    }

    // Edge case: Zero or negative payment amount
    if (!firstPaymentAmount || firstPaymentAmount <= 0) {
      const suggestedAmount = Math.max(
        totalPropertyPrice * (this.MIN_FIRST_PAYMENT_PERCENTAGE / 100),
        this.MIN_PAYMENT_AMOUNT
      );
      return {
        isValid: false,
        error: "First payment amount must be greater than zero",
        suggestedAmount: Math.round(suggestedAmount),
        percentage: (suggestedAmount / totalPropertyPrice) * 100
      };
    }

    // Edge case: Payment amount exceeds property price
    if (firstPaymentAmount > totalPropertyPrice) {
      return {
        isValid: false,
        error: "First payment cannot exceed the total property price",
        suggestedAmount: totalPropertyPrice,
        percentage: 100
      };
    }

    // Calculate percentage
    const percentage = (firstPaymentAmount / totalPropertyPrice) * 100;

    // Check minimum percentage requirement
    if (percentage < this.MIN_FIRST_PAYMENT_PERCENTAGE) {
      const suggestedAmount = Math.max(
        totalPropertyPrice * (this.MIN_FIRST_PAYMENT_PERCENTAGE / 100),
        this.MIN_PAYMENT_AMOUNT
      );
      return {
        isValid: false,
        error: `First payment must be at least ${this.MIN_FIRST_PAYMENT_PERCENTAGE}% of the property price (${Math.round(suggestedAmount)} MAD)`,
        suggestedAmount: Math.round(suggestedAmount),
        percentage: this.MIN_FIRST_PAYMENT_PERCENTAGE
      };
    }

    // Check minimum payment amount
    if (firstPaymentAmount < this.MIN_PAYMENT_AMOUNT) {
      return {
        isValid: false,
        error: `First payment must be at least ${this.MIN_PAYMENT_AMOUNT.toLocaleString()} MAD`,
        suggestedAmount: this.MIN_PAYMENT_AMOUNT,
        percentage: (this.MIN_PAYMENT_AMOUNT / totalPropertyPrice) * 100
      };
    }

    // Check maximum payment amount
    if (firstPaymentAmount > this.MAX_PAYMENT_AMOUNT) {
      return {
        isValid: false,
        error: `First payment cannot exceed ${this.MAX_PAYMENT_AMOUNT.toLocaleString()} MAD`,
        suggestedAmount: this.MAX_PAYMENT_AMOUNT,
        percentage: (this.MAX_PAYMENT_AMOUNT / totalPropertyPrice) * 100
      };
    }

    return {
      isValid: true,
      percentage: Math.round(percentage * 100) / 100
    };
  }

  /**
   * Validates a complete payment plan
   */
  static validatePaymentPlan(
    payments: Array<{ amount: number; dueDate: Date }>,
    totalPropertyPrice: number
  ): PaymentValidationResult {
    if (!payments || payments.length === 0) {
      return {
        isValid: false,
        error: "At least one payment is required"
      };
    }

    // Sort payments by due date to identify the first payment
    const sortedPayments = [...payments].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    const firstPayment = sortedPayments[0];
    const firstPaymentValidation = this.validateFirstPayment(
      firstPayment.amount,
      totalPropertyPrice
    );

    if (!firstPaymentValidation.isValid) {
      return firstPaymentValidation;
    }

    // Validate total payments don't exceed property price
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    if (totalPayments > totalPropertyPrice) {
      return {
        isValid: false,
        error: `Total payments (${totalPayments.toLocaleString()} MAD) cannot exceed property price (${totalPropertyPrice.toLocaleString()} MAD)`
      };
    }

    // Validate all payment amounts are positive
    for (const payment of payments) {
      if (payment.amount <= 0) {
        return {
          isValid: false,
          error: "All payment amounts must be greater than zero"
        };
      }
    }

    return {
      isValid: true,
      percentage: firstPaymentValidation.percentage
    };
  }

  /**
   * Calculates the recommended first payment amount
   */
  static calculateRecommendedFirstPayment(
    totalPropertyPrice: number,
    percentage: number = this.MIN_FIRST_PAYMENT_PERCENTAGE
  ): number {
    if (!totalPropertyPrice || totalPropertyPrice <= 0) {
      return 0;
    }

    const recommendedAmount = totalPropertyPrice * (percentage / 100);
    return Math.max(Math.round(recommendedAmount), this.MIN_PAYMENT_AMOUNT);
  }

  /**
   * Generates a default payment plan with 20% first payment
   */
  static generateDefaultPaymentPlan(
    totalPropertyPrice: number,
    numberOfPayments: number = 4
  ): PaymentPlan {
    if (!totalPropertyPrice || totalPropertyPrice <= 0) {
      throw new Error("Property price must be greater than zero");
    }

    if (numberOfPayments < 1) {
      throw new Error("Number of payments must be at least 1");
    }

    const firstPaymentAmount = this.calculateRecommendedFirstPayment(totalPropertyPrice);
    const remainingAmount = totalPropertyPrice - firstPaymentAmount;
    const remainingPayments = numberOfPayments - 1;
    const remainingPaymentAmount = remainingPayments > 0 
      ? Math.round(remainingAmount / remainingPayments) 
      : 0;

    const payments = [];
    const today = new Date();

    // First payment
    payments.push({
      amount: firstPaymentAmount,
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isFirstPayment: true
    });

    // Remaining payments
    for (let i = 1; i < numberOfPayments; i++) {
      const dueDate = new Date(today.getTime() + (30 * (i + 1)) * 24 * 60 * 60 * 1000);
      payments.push({
        amount: remainingPaymentAmount,
        dueDate,
        isFirstPayment: false
      });
    }

    return {
      payments,
      totalAmount: totalPropertyPrice,
      firstPaymentAmount,
      firstPaymentPercentage: (firstPaymentAmount / totalPropertyPrice) * 100
    };
  }
} 