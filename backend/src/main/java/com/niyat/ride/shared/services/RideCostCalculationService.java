package com.niyat.ride.shared.services;

import java.math.BigDecimal;

public interface RideCostCalculationService {
    
    /**
     * Calculate the estimated cost for a ride based on distance and vehicle type
     * @param distanceKm Distance in kilometers
     * @param vehicleTypeId Vehicle type ID (optional)
     * @return Estimated cost in ETB
     */
    BigDecimal calculateEstimatedCost(Double distanceKm, Long vehicleTypeId);
    
    /**
     * Calculate the final cost for a ride (same as estimated for now)
     * @param distanceKm Distance in kilometers
     * @param vehicleTypeId Vehicle type ID (optional)
     * @return Final cost in ETB
     */
    BigDecimal calculateFinalCost(Double distanceKm, Long vehicleTypeId);
    
    /**
     * Get the current base price amount
     * @return Base price in ETB
     */
    BigDecimal getBasePrice();
    
    /**
     * Calculate distance price based on vehicle type and distance
     * @param distanceKm Distance in kilometers
     * @param vehicleTypeId Vehicle type ID (optional)
     * @return Distance price in ETB
     */
    BigDecimal calculateDistancePrice(Double distanceKm, Long vehicleTypeId);
}
