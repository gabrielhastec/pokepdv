package dev.pokepdv.api.modules.funcionario.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface FuncionarioRepository extends JpaRepository<Funcionario, UUID> {

    Optional<Funcionario> findByEmailAndTenantId(String email, UUID tenantId);

    boolean existsByEmailAndTenantId(String email, UUID tenantId);

    boolean existsByEmailAndTenantIdAndIdNot(String email, UUID tenantId, UUID id);

    long countByRoleAndAtivoAndTenantId(Funcionario.Role role, boolean ativo, UUID tenantId);
}
