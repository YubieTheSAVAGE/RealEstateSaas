const prisma = require("../utils/prisma");

class PaymentService {
  static MIN_FIRST_PAYMENT_PERCENTAGE = 20;
  static MIN_PAYMENT_AMOUNT = 1000;
  static MAX_PAYMENT_AMOUNT = 10000000;

  /**
   * Calculates the total value of property extras (balcony, terrace, pool, etc.)
   */
  static calculateExtrasTotal(property) {
    let total = 0;
    const breakdown = {};

    // Calculate balcony cost
    if (property.balcon && property.prixBalconPct && property.prixM2) {
      const balconCost = property.balcon * (property.prixM2 * property.prixBalconPct / 100);
      breakdown.balcon = balconCost;
      total += balconCost;
    }

    // Calculate terrace cost
    if (property.terrasse && property.prixTerrassePct && property.prixM2) {
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

    return { total, breakdown };
  }

  /**
   * Calculates the total commission amount
   */
  static calculateCommissionTotal(property) {
    if (!property.commissionPerM2 || property.commissionPerM2 <= 0) {
      return 0;
    }

    let totalSurface = 0;

    // For properties with habitable surface (apartments, villas, duplexes)
    if (property.habitable) {
      totalSurface += property.habitable;
    }

    // Add balcony surface
    if (property.balcon) {
      totalSurface += property.balcon;
    }

    // Add terrace surface
    if (property.terrasse) {
      totalSurface += property.terrasse;
    }

    // Add pool surface
    if (property.piscine) {
      totalSurface += property.piscine;
    }

    // For land and store types, use totalArea
    if (!property.habitable && property.totalArea) {
      totalSurface = property.totalArea;
      // Add mezzanine for stores
      if (property.mezzanineArea) {
        totalSurface += property.mezzanineArea;
      }
    }

    return totalSurface * property.commissionPerM2;
  }

  /**
   * Calculates the complete first payment breakdown
   */
  static calculateFirstPaymentBreakdown(property, folderFees = 0) {
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

    // Calculate extras total
    const { total: extrasTotal, breakdown } = this.calculateExtrasTotal(property);

    // Calculate commission total
    const commissionTotal = this.calculateCommissionTotal(property);

    // Calculate base property price (total price minus extras and commission)
    const basePropertyPrice = property.prixTotal - extrasTotal - commissionTotal;

    // Calculate 20% of base property price
    const baseAmount = basePropertyPrice * (this.MIN_FIRST_PAYMENT_PERCENTAGE / 100);

    // Calculate total first payment
    const totalFirstPayment = baseAmount + folderFees + extrasTotal + commissionTotal;

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
   * Validates payment plan on the server side
   */
  static validatePaymentPlan(payments, propertyPrice, folderFees = 0, property = null) {
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
    this.validateFirstPayment(firstPayment.amount, propertyPrice, folderFees, property);

    // Validate total payments
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalWithFolderFees = totalPayments + folderFees;
    
    if (totalWithFolderFees > propertyPrice) {
      throw new Error(`Total payments including folder fees (${totalWithFolderFees.toLocaleString()} MAD) cannot exceed property price (${propertyPrice.toLocaleString()} MAD)`);
    }

    return true;
  }

  /**
   * Validates first payment amount
   */
  static validateFirstPayment(amount, propertyPrice, folderFees = 0, property = null) {
    if (!amount || amount <= 0) {
      throw new Error("First payment amount must be greater than zero");
    }

    if (amount > propertyPrice) {
      throw new Error("First payment cannot exceed the total property price");
    }

    // Calculate the minimum required first payment
    const calculation = this.calculateFirstPaymentBreakdown(property, folderFees);
    const minimumRequired = calculation.totalFirstPayment;

    // Check if the payment meets the minimum requirement
    if (amount < minimumRequired) {
      throw new Error(`First payment must be at least ${Math.round(minimumRequired).toLocaleString()} MAD (includes 20% base + folder fees + extras + commission)`);
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
   * Calculates the recommended first payment amount
   */
  static calculateRecommendedFirstPayment(propertyPrice, folderFees = 0, property = null) {
    if (!propertyPrice || propertyPrice <= 0) {
      return 0;
    }

    const calculation = this.calculateFirstPaymentBreakdown(property, folderFees);
    return Math.max(Math.round(calculation.totalFirstPayment), this.MIN_PAYMENT_AMOUNT);
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