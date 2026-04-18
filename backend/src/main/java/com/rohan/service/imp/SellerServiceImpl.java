package com.rohan.service.imp;

import com.rohan.Config.JwtProvider;
import com.rohan.Repository.AddressRepository;
import com.rohan.Repository.SellerRepository;
import com.rohan.Repository.UserRepository;
import com.rohan.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;   // ✅ YAHAN HOGA
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;

    @Override
    public Seller getSellerProfile(String jwt) {
        String email = jwtProvider.getEmailFromToken(jwt);
        return sellerRepository.findByEmail(email);
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {

        // ✅ Check Seller Exist
        Seller sellerExists = sellerRepository.findByEmail(seller.getEmail());
        if (sellerExists != null) {
            throw new Exception("Seller already exists, use different email");
        }

        // ✅ Save Address
        Address savedAddress = addressRepository.save(seller.getPickupAddress());

        // ✅ Encode Password
        String encodedPassword = passwordEncoder.encode(seller.getPassword());

        // ✅ Create Seller
        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(encodedPassword);
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickupAddress(savedAddress);
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBuisnessDetails(seller.getBuisnessDetails());
        newSeller.setMobile(seller.getMobile());
        newSeller.setRole(USER_ROLE.ROLE_SELLER);

        Seller savedSeller = sellerRepository.save(newSeller);

        // ✅ YEH IMPORTANT PART HAI (USER TABLE SAVE)
        User user = new User();
        user.setEmail(savedSeller.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(USER_ROLE.ROLE_SELLER);

        userRepository.save(user);

        return savedSeller;
    }

    @Override
    public Seller getSellerById(Long id) throws Exception {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new Exception("Seller not found with id " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws Exception {
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            throw new Exception("Seller not found");
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus status) {
        return sellerRepository.findAllByAccountStatus(status);
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) {

        Seller existingSeller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found with id " + id));

        if (seller.getSellerName() != null)
            existingSeller.setSellerName(seller.getSellerName());

        if (seller.getMobile() != null)
            existingSeller.setMobile(seller.getMobile());

        if (seller.getEmail() != null)
            existingSeller.setEmail(seller.getEmail());

        if (seller.getGSTIN() != null)
            existingSeller.setGSTIN(seller.getGSTIN());

        if (seller.getPassword() != null)
            existingSeller.setPassword(passwordEncoder.encode(seller.getPassword()));

        if (seller.getBankDetails() != null)
            existingSeller.setBankDetails(seller.getBankDetails());

        if (seller.getBuisnessDetails() != null)
            existingSeller.setBuisnessDetails(seller.getBuisnessDetails());

        if (seller.getPickupAddress() != null) {

            Address existingAddress = existingSeller.getPickupAddress();
            if (existingAddress == null) {
                existingAddress = new Address();
            }

            if (seller.getPickupAddress().getLocality() != null)
                existingAddress.setLocality(seller.getPickupAddress().getLocality());

            if (seller.getPickupAddress().getAddress() != null)
                existingAddress.setAddress(seller.getPickupAddress().getAddress());

            if (seller.getPickupAddress().getCity() != null)
                existingAddress.setCity(seller.getPickupAddress().getCity());

            Address savedAddress = addressRepository.save(existingAddress);
            existingSeller.setPickupAddress(savedAddress);
        }

        return sellerRepository.save(existingSeller);
    }

    @Override
    public void deleteSeller(Long id) throws Exception {
        Seller seller = getSellerById(id);
        sellerRepository.delete(seller);
    }

    @Override
    public Seller verifyEmail(String email, String otp) {
        return null;
    }

    @Override
    public Seller updateSellerAccountStatus(Long id, AccountStatus status) {
        return null;
    }
}