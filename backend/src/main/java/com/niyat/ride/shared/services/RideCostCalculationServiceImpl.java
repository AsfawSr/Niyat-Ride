package com.niyat.ride.shared.services;

import com.niyat.ride.features.admin.pricing_management.services.BasePriceService;
import com.niyat.ride.features.admin.vehicle_type_management.repositories.VehicleTypeRepository;
import com.niyat.ride.vehicle.models.VehicleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class RideCostCalculationServiceImpl implements RideCostCalculationService {
    
    private final BasePriceService basePriceService;
    private final VehicleTypeRepository vehicleTypeRepository;
    
    // Default price per km if no vehicle type is specified
    private static final BigDecimal DEFAULT_PRICE_PER_KM = new BigDecimal("10.00");
    
    @Override
    public BigDecimal calculateEstimatedCost(Double distanceKm, Long vehicleTypeId) {
        if (distanceKm == null || distanceKm <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal basePrice = getBasePrice();
        BigDecimal distancePrice = calculateDistancePrice(distanceKm, vehicleTypeId);
        
        BigDecimal totalCost = basePrice.add(distancePrice);
        
        log.debug("Calculated estimated cost: Base price: {} ETB, Distance price: {} ETB, Total: {} ETB", 
                basePrice, distancePrice, totalCost);
        
        return totalCost.setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public BigDecimal calculateFinalCost(Double distanceKm, Long vehicleTypeId) {
        // For now, final cost is the same as estimated cost
        // In the future, this could include surge pricing, discounts, etc.
        return calculateEstimatedCost(distanceKm, vehicleTypeId);
    }
    
    @Override
    public BigDecimal getBasePrice() {
        try {
            return basePriceService.getCurrentBasePriceAmount();
        } catch (Exception e) {
            log.warn("Could not retrieve base price, using default: 50 ETB", e);
            return new BigDecimal("50.00");
        }
    }
    
    @Override
    public BigDecimal calculateDistancePrice(Double distanceKm, Long vehicleTypeId) {
        if (distanceKm == null || distanceKm <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal pricePerKm = DEFAULT_PRICE_PER_KM;
        
        // Get vehicle type specific price per km if available
        if (vehicleTypeId != null) {
            try {
                VehicleType vehicleType = vehicleTypeRepository.findById(vehicleTypeId)
                        .orElse(null);
                if (vehicleType != null && vehicleType.getPricePerKm() != null) {
                    pricePerKm = vehicleType.getPricePerKm();
                    log.debug("Using vehicle type {} price per km: {} ETB", 
                            vehicleType.getName(), pricePerKm);
                }
            } catch (Exception e) {
                log.warn("Could not retrieve vehicle type pricing for ID: {}, using default", vehicleTypeId, e);
            }
        }
        
        BigDecimal distance = BigDecimal.valueOf(distanceKm);
        BigDecimal distancePrice = pricePerKm.multiply(distance);
        
        log.debug("Distance price calculation: {} km × {} ETB/km = {} ETB", 
                distanceKm, pricePerKm, distancePrice);
        
        return distancePrice.setScale(2, RoundingMode.HALF_UP);
    }
}
