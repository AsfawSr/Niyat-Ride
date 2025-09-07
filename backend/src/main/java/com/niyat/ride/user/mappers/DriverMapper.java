package com.niyat.ride.user.mappers;

import com.niyat.ride.user.dtos.DriverResponseDTO;
import com.niyat.ride.user.dtos.DriverSignupDTO;
import com.niyat.ride.user.models.Driver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DriverMapper {
    Driver toEntity(DriverSignupDTO dto);

    @Mapping(target = "latitude", expression = "java(driver.getCurrentLocation() != null ? driver.getCurrentLocation().getY() : null)")
    @Mapping(target = "longitude", expression = "java(driver.getCurrentLocation() != null ? driver.getCurrentLocation().getX() : null)")
    DriverResponseDTO toResponseDTO(Driver driver);
}

