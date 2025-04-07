package tn.esprit.examen.jihed.horchaniGestionProduit.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.examen.jihed.horchaniGestionProduit.entities.Client;
import tn.esprit.examen.jihed.horchaniGestionProduit.repositories.IExempleRepository;
@Slf4j
@RequiredArgsConstructor
@Service
public class ExempleServicesImpl implements IExempleServices {

    private final IExempleRepository exempleRepository;

    @Override
    public Client add(Client client) {
        return exempleRepository.save(client);
    }

    @Scheduled(cron = "*/15 * * * * *")
    @Override
    public void test() {
        log.info("testing");
    }
}
