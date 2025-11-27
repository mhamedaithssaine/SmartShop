package org.example.smartshop.service;

import org.example.smartshop.dto.request.PromoCodeRequest;
import org.example.smartshop.dto.response.PromoCodeResponse;
import org.example.smartshop.exception.ResourceNotFoundException;
import org.example.smartshop.exception.ValidationException;
import org.example.smartshop.mapper.PromoCodeMapper;
import org.example.smartshop.model.PromoCode;
import org.example.smartshop.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromoCodeService {

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    @Autowired
    private PromoCodeMapper promoCodeMapper;

    // Créer un code promo
    @Transactional
    public PromoCodeResponse create(PromoCodeRequest request) {
        if (promoCodeRepository.existsByCode(request.getCode())) {
            throw new ValidationException("Ce code promo existe déjà !");
        }

        if (request.getDateExpiration().isBefore(request.getDateDebut())) {
            throw new ValidationException("La date d'expiration doit être après la date de début !");
        }

        PromoCode promoCode = promoCodeMapper.toEntity(request);
        promoCode = promoCodeRepository.save(promoCode);
        return promoCodeMapper.toResponse(promoCode);
    }

    // Récupérer un code promo par ID
    @Transactional(readOnly = true)
    public PromoCodeResponse findById(Long id) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo non trouvé avec l'ID: " + id));
        return promoCodeMapper.toResponse(promoCode);
    }

    // Récupérer un code promo par code
    @Transactional(readOnly = true)
    public PromoCodeResponse findByCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo non trouvé: " + code));
        return promoCodeMapper.toResponse(promoCode);
    }

    // Récupérer tous les codes promo
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> findAll() {
        return promoCodeRepository.findAll()
                .stream()
                .map(promoCodeMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Récupérer les codes promo actifs
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> findActivePromoCodes() {
        return promoCodeRepository.findByActifTrue()
                .stream()
                .map(promoCodeMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Récupérer les codes promo valides
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> findValidPromoCodes() {
        return promoCodeRepository.findValidPromoCodesByDate(LocalDate.now())
                .stream()
                .map(promoCodeMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Mettre à jour un code promo
    @Transactional
    public PromoCodeResponse update(Long id, PromoCodeRequest request) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo non trouvé avec l'ID: " + id));

        if (!promoCode.getCode().equals(request.getCode()) &&
                promoCodeRepository.existsByCode(request.getCode())) {
            throw new ValidationException("Ce code promo existe déjà !");
        }

        if (request.getDateExpiration().isBefore(request.getDateDebut())) {
            throw new ValidationException("La date d'expiration doit être après la date de début !");
        }

        promoCode.setCode(request.getCode());
        promoCode.setPourcentageRemise(request.getPourcentageRemise());
        promoCode.setDateDebut(request.getDateDebut());
        promoCode.setDateExpiration(request.getDateExpiration());
        promoCode.setNombreUtilisationsMax(request.getNombreUtilisationsMax());

        promoCode = promoCodeRepository.save(promoCode);
        return promoCodeMapper.toResponse(promoCode);
    }

    // Activer/Désactiver un code promo
    @Transactional
    public PromoCodeResponse toggleActive(Long id) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo non trouvé avec l'ID: " + id));

        promoCode.setActif(!promoCode.getActif());
        promoCode = promoCodeRepository.save(promoCode);
        return promoCodeMapper.toResponse(promoCode);
    }

    // Supprimer un code promo
    @Transactional
    public void delete(Long id) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo non trouvé avec l'ID: " + id));

        promoCodeRepository.delete(promoCode);
    }

    // Valider un code promo
    @Transactional(readOnly = true)
    public PromoCode validatePromoCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new ValidationException("Code promo invalide"));

        if (!promoCode.isUtilisable()) {
            throw new ValidationException("Ce code promo n'est pas valide ou a expiré");
        }

        return promoCode;
    }

    // Incrémenter le nombre d'utilisations
    @Transactional
    public void incrementUsage(Long id) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo non trouvé"));

        promoCode.setNombreUtilisations(promoCode.getNombreUtilisations() + 1);
        promoCodeRepository.save(promoCode);
    }
}