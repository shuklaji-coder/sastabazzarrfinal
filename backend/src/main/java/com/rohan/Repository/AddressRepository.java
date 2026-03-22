package com.rohan.Repository;

import com.rohan.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository  extends JpaRepository<Address,Long> {
}
