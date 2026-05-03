package dev.pokepdv.api.modules.produto.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findTop50ByTenantIdOrderByCriadoEmDesc(UUID tenantId);

    boolean existsByNomeAndTenantId(String nome, UUID tenantId);
    boolean existsByNomeAndTenantIdAndIdNot(String nome, UUID tenantId, UUID id);
    boolean existsByEanAndTenantId(String ean, UUID tenantId);
    boolean existsByEanAndTenantIdAndIdNot(String ean, UUID tenantId, UUID id);

}