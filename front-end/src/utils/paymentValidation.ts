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

export interface FirstPaymentCalculation {
  baseAmount: number; // 20% of total price
  folderFees: number;
  extrasTotal: number;
  commissionTotal: number;
  totalFirstPayment: number;
  breakdown: {
    balcon?: number;
    terrasse?: number;
    piscine?: number;
    parking?: number;
    mezzanine?: number;
  };
}

export interface TotalPaymentBreakdown {
  basePrice: number;
  folderFees: number;
  commissionTotal: number;
  parkingPrice: number;
  totalPayment: number;
  surfaceBreakdown: {
    habitable: number;
    balcon: number;
    terrasse: number;
    piscine: number;
    totalSurface: number;
  };
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

  /**
   * Calculates the complete first payment breakdown
   */
  static calculateFirstPaymentBreakdown(
    property: any,
    folderFees: number = 0
  ): FirstPaymentCalculation {
    if (!property || !property.prixTotal || property.prixTotal <= 0) {
      return {
        baseAmount: 0,
        folderFees: 0,
        extrasTotal: 0,
        commissionTotal: 0,
        totalFirstPayment: 0,
        breakdown: {}
      };
    }

    // Calculate commission total
    const commissionTotal = this.calculateCommissionTotal(property);

    // Calculate extras total (only for M2 pricing)
    const { total: extrasTotal, breakdown } = this.calculateExtrasTotal(property);

    let baseAmount: number;
    let totalFirstPayment: number;

    if (property.prixType === "FIXE") {
      // Case "FIXE": prixTotal includes extras
      baseAmount = property.prixTotal * 0.2;
      totalFirstPayment = baseAmount + folderFees + commissionTotal;
    } else if (property.prixType === "M2") {
      // Case "M2": prixTotal excludes commission, need to add extras separately
      baseAmount = property.prixTotal * 0.2;
      totalFirstPayment = baseAmount + extrasTotal + folderFees + commissionTotal;
    } else {
      // Fallback for unknown pricing type
      baseAmount = property.prixTotal * 0.2;
      totalFirstPayment = baseAmount + folderFees + commissionTotal;
    }

    return {
      baseAmount,
      folderFees,
      extrasTotal,
      commissionTotal,
      totalFirstPayment,
      breakdown
    };
  }

  /**
   * Calculates the complete total payment breakdown
   */
  static calculateTotalPaymentBreakdown(
    property: any,
    folderFees: number = 0
  ): TotalPaymentBreakdown {
    if (!property || !property.prixTotal || property.prixTotal <= 0) {
      return {
        basePrice: 0,
        folderFees: 0,
        commissionTotal: 0,
        parkingPrice: 0,
        totalPayment: 0,
        surfaceBreakdown: {
          habitable: 0,
          balcon: 0,
          terrasse: 0,
          piscine: 0,
          totalSurface: 0
        }
      };
    }

    // Calculate surface breakdown
    const habitable = property.habitable || 0;
    const balcon = property.balcon || 0;
    const terrasse = property.terrasse || 0;
    const piscine = property.piscine || 0;
    const totalSurface = habitable + balcon + terrasse + piscine;

    // Calculate commission total
    const commissionTotal = property.commissionPerM2 ? property.commissionPerM2 * totalSurface : 0;

    // Calculate parking price
    const parkingPrice = (property.parkingDisponible && !property.parkingInclus && property.prixParking) 
      ? property.prixParking 
      : 0;

    // Calculate total payment
    const totalPayment = property.prixTotal + folderFees + commissionTotal + parkingPrice;

    return {
      basePrice: property.prixTotal,
      folderFees,
      commissionTotal,
      parkingPrice,
      totalPayment,
      surfaceBreakdown: {
        habitable,
        balcon,
        terrasse,
        piscine,
        totalSurface
      }
    };
  }

  /**
   * Calculates the total value of property extras (balcony, terrace, pool, etc.)
   */
  static calculateExtrasTotal(property: any): { total: number; breakdown: any } {
    let total = 0;
    const breakdown: any = {};

    // Only calculate extras prices for M2 pricing type
    if (property.prixType === "M2" && property.prixM2) {
      // Calculate balcony cost
      if (property.balcon && property.prixBalconPct) {
        const balconCost = property.balcon * (property.prixM2 * property.prixBalconPct / 100);
        breakdown.balcon = balconCost;
        total += balconCost;
      }

      // Calculate terrace cost
      if (property.terrasse && property.prixTerrassePct) {
        const terrasseCost = property.terrasse * (property.prixM2 * property.prixTerrassePct / 100);
        breakdown.terrasse = terrasseCost;
        total += terrasseCost;
      }

      // Calculate pool cost
      if (property.piscine && property.prixPiscine) {
        const piscineCost = property.piscine * property.prixPiscine;
        breakdown.piscine = piscineCost;
        total += piscineCost;
      }

      // Calculate parking cost (if not included)
      if (property.parkingDisponible && !property.parkingInclus && property.prixParking) {
        breakdown.parking = property.prixParking;
        total += property.prixParking;
      }

      // Calculate mezzanine cost (for stores)
      if (property.mezzanineArea && property.mezzaninePrice) {
        breakdown.mezzanine = property.mezzaninePrice;
        total += property.mezzaninePrice;
      }
    }

    return { total, breakdown };
  }

  /**
   * Calculates the total commission amount
   */
  static calculateCommissionTotal(property: any): number {
    if (!property.commissionPerM2 || property.commissionPerM2 <= 0) {
      return 0;
    }

    // Calculate total surface for commission
    const totalExtrasSurface = (property.balcon || 0) + (property.terrasse || 0) + (property.piscine || 0);
    const totalSurface = (property.habitable || 0) + totalExtrasSurface;

    // For land and store types, use totalArea if habitable is not available
    if (!property.habitable && property.totalArea) {
      const landStoreSurface = property.totalArea + (property.mezzanineArea || 0);
      return landStoreSurface * property.commissionPerM2;
    }

    return totalSurface * property.commissionPerM2;
  }
} 