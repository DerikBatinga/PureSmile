package com.pure.smile;

import com.pure.smile.enums.ConsultaStatus;
import com.pure.smile.enums.UsuarioRole;
import com.pure.smile.model.*;
import com.pure.smile.repository.*;
import com.pure.smile.service.DentistaService;
import com.pure.smile.service.PacienteService;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class RepositoryIntegrationTests {
    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        registry.add("spring.datasource.url", () -> setting("DB_URL", dotenv));
        registry.add("spring.datasource.username", () -> setting("DB_USERNAME", dotenv));
        registry.add("spring.datasource.password", () -> setting("DB_PASSWORD", dotenv));
    }

    private static String setting(String name, Dotenv dotenv) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            value = dotenv.get(name);
        }
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Configure " + name + " no arquivo .env ou no ambiente antes dos testes de banco");
        }
        if (value.length() >= 2 && ((value.startsWith("'") && value.endsWith("'"))
                || (value.startsWith("\"") && value.endsWith("\"")))) {
            value = value.substring(1, value.length() - 1);
        }
        return value;
    }

    @Autowired UserRepository usuarios;
    @Autowired ConvenioRepository convenios;
    @Autowired PacienteRepository pacientes;
    @Autowired DentistaRepository dentistas;
    @Autowired ConsultaRepository consultas;
    @Autowired ProcedimentoRepository procedimentos;
    @Autowired TratamentoRepository tratamentos;
    @Autowired PacienteService pacienteService;
    @Autowired DentistaService dentistaService;
    @Autowired PasswordEncoder passwordEncoder;

    @Test
    void servicosCriamPerfisComSenhaCodificada() {
        String sufixo = UUID.randomUUID().toString().substring(0, 8);
        PacienteModel paciente = new PacienteModel();
        paciente.setNome("Paciente serviço");
        paciente.setEmail("paciente-servico-" + sufixo + "@example.test");
        paciente.setSenha("senha-temporaria");
        paciente.setCpf("8" + sufixo.replaceAll("[^0-9]", "0").substring(0, 8) + "02");
        pacienteService.criar(paciente);
        PacienteModel pacienteSalvo = pacienteService.listarTodos().stream()
                .filter(p -> paciente.getEmail().equals(p.getEmail())).findFirst().orElseThrow();
        UserModel usuarioPaciente = usuarios.readUser(pacienteSalvo.getIdUser());
        assertEquals(UsuarioRole.PACIENTE, usuarioPaciente.getRole());
        assertTrue(passwordEncoder.matches("senha-temporaria", usuarioPaciente.getSenha()));

        DentistaModel dentista = new DentistaModel();
        dentista.setNome("Dentista serviço");
        dentista.setEmail("dentista-servico-" + sufixo + "@example.test");
        dentista.setSenha("outra-senha");
        dentista.setCro("CRO-S-" + sufixo);
        dentistaService.criar(dentista);
        DentistaModel dentistaSalvo = dentistaService.listarTodos().stream()
                .filter(d -> dentista.getEmail().equals(d.getEmail())).findFirst().orElseThrow();
        UserModel usuarioDentista = usuarios.readUser(dentistaSalvo.getIdUser());
        assertEquals(UsuarioRole.DENTISTA, usuarioDentista.getRole());
        assertTrue(passwordEncoder.matches("outra-senha", usuarioDentista.getSenha()));
    }

    @Test
    void cadastroCompletoUsaEsquemaSqlServerERetornaChaves() {
        String sufixo = UUID.randomUUID().toString().substring(0, 8);

        ConvenioModel convenio = new ConvenioModel();
        convenio.setNome("Convênio teste " + sufixo);
        assertEquals(1, convenios.saveConvenio(convenio));
        Long idConvenio = convenios.readAll().stream()
                .filter(c -> convenio.getNome().equals(c.getNome()))
                .findFirst().orElseThrow().getIdConvenio();
        convenio.setIdConvenio(idConvenio);
        convenio.setTelefone("1133334444");
        convenio.setAtivo(true);
        assertEquals(1, convenios.updateConvenio(convenio));
        assertEquals("1133334444", convenios.readConvenio(idConvenio).getTelefone());

        PacienteModel paciente = new PacienteModel();
        paciente.setNome("Paciente teste");
        paciente.setEmail("paciente-" + sufixo + "@example.test");
        paciente.setSenha("hash-de-teste");
        paciente.setRole(UsuarioRole.PACIENTE);
        paciente.setCpf("1" + sufixo.replaceAll("[^0-9]", "0").substring(0, 8) + "01");
        paciente.setDataNasc(new Date(946684800000L));
        paciente.setIdConvenio(idConvenio);
        Long idUsuarioPaciente = usuarios.saveUser(paciente);
        assertEquals(1, pacientes.savePaciente(idUsuarioPaciente, paciente));
        PacienteModel salvo = pacientes.readAll().stream()
                .filter(p -> idUsuarioPaciente.equals(p.getIdUser())).findFirst().orElseThrow();
        assertEquals(idConvenio, salvo.getIdConvenio());
        assertEquals(paciente.getEmail(), salvo.getEmail());
        assertNotNull(salvo.getDataNasc());
        salvo.setTelefone("11999990000");
        assertEquals(1, pacientes.updatePaciente(salvo));
        assertEquals("11999990000", pacientes.readId(salvo.getIdPaciente()).getTelefone());
        paciente.setIdUser(idUsuarioPaciente);
        paciente.setNome("Paciente atualizado");
        assertEquals(1, usuarios.updateUser(paciente));
        assertEquals("Paciente atualizado", usuarios.readUser(idUsuarioPaciente).getNome());

        DentistaModel dentista = new DentistaModel();
        dentista.setNome("Dentista teste");
        dentista.setEmail("dentista-" + sufixo + "@example.test");
        dentista.setSenha("hash-de-teste");
        dentista.setRole(UsuarioRole.DENTISTA);
        dentista.setCro("CRO-" + sufixo);
        Long idUsuarioDentista = usuarios.saveUser(dentista);
        assertEquals(1, dentistas.saveDentista(idUsuarioDentista, dentista));
        DentistaModel dentistaSalvo = dentistas.readAll().stream()
                .filter(d -> idUsuarioDentista.equals(d.getIdUser())).findFirst().orElseThrow();
        assertEquals(dentista.getEmail(), dentistaSalvo.getEmail());
        dentistaSalvo.setEspecialidade("Clínica geral");
        assertEquals(1, dentistas.updateDentista(dentistaSalvo));
        assertEquals("Clínica geral", dentistas.readId(dentistaSalvo.getIdDentista()).getEspecialidade());

        ConsultaModel consulta = new ConsultaModel();
        consulta.setDataConsulta(LocalDateTime.now().plusDays(2).withNano(0));
        consulta.setStatus(ConsultaStatus.AGENDADO);
        consulta.setIdPaciente(salvo.getIdPaciente());
        consulta.setIdDentista(dentistaSalvo.getIdDentista());
        assertEquals(1, consultas.saveConsulta(consulta));
        ConsultaModel consultaSalva = consultas.readAll().stream()
                .filter(c -> salvo.getIdPaciente().equals(c.getIdPaciente())).findFirst().orElseThrow();
        assertTrue(consultas.existeConflito(dentistaSalvo.getIdDentista(), consulta.getDataConsulta(), 0L));
        assertEquals(ConsultaStatus.AGENDADO, consultaSalva.getStatus());
        consultaSalva.setObservacoes("Reagendada");
        assertEquals(1, consultas.updateConsulta(consultaSalva));
        assertEquals("Reagendada", consultas.readConsulta(consultaSalva.getIdConsulta()).getObservacoes());

        ProcedimentoModel procedimento = new ProcedimentoModel();
        procedimento.setNome("Limpeza teste " + sufixo);
        procedimento.setValor(new BigDecimal("123.45"));
        assertEquals(1, procedimentos.saveProcedimento(procedimento));
        ProcedimentoModel procedimentoSalvo = procedimentos.readAll().stream()
                .filter(p -> procedimento.getNome().equals(p.getNome())).findFirst().orElseThrow();
        assertEquals(0, new BigDecimal("123.45").compareTo(procedimentoSalvo.getValor()));
        procedimentoSalvo.setValor(new BigDecimal("130.00"));
        assertEquals(1, procedimentos.updateProcedimento(procedimentoSalvo));
        assertEquals(0, new BigDecimal("130.00").compareTo(procedimentos.readProcedimento(procedimentoSalvo.getIdProcedimento()).getValor()));

        TratamentoModel tratamento = new TratamentoModel();
        tratamento.setNome("Tratamento teste " + sufixo);
        tratamento.setStatus("AGENDADO");
        tratamento.setIdPaciente(salvo.getIdPaciente());
        tratamento.setIdConsulta(consultaSalva.getIdConsulta());
        Long idTratamento = tratamentos.saveTratamento(tratamento);
        assertEquals(consultaSalva.getIdConsulta(), tratamentos.readTratamento(idTratamento).getIdConsulta());
        tratamento.setIdTratamento(idTratamento);
        tratamento.setDescricao("Descrição atualizada");
        assertEquals(1, tratamentos.updateTratamento(tratamento));
        assertEquals("Descrição atualizada", tratamentos.readTratamento(idTratamento).getDescricao());
        assertEquals(1, tratamentos.registrarPagamento(idTratamento, new BigDecimal("123.45"), LocalDateTime.now()));
        assertEquals(0, new BigDecimal("123.45").compareTo(tratamentos.readTratamento(idTratamento).getPagamento()));
        assertEquals(0, tratamentos.updateTratamento(tratamento));
    }
}
