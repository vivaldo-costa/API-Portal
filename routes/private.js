import express from "express";
import { PrismaClient } from "@prisma/client";
//import authMiddleware from "../middlewares/auth.js"; // Middleware de autenticação

const router = express.Router();
const prisma = new PrismaClient();

//############################################################# AGENDA   ##################################################################

// Criar uma nova agenda
router.post("/agendas", async (req, res) => {
    try {
        const { codTicket, data, hora, estado } = req.body;

        const agenda = await prisma.agenda.create({
            data: {
                codTicket,
                data,
                hora,
                estado,
            },
        });

        res.status(201).json(agenda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar agenda." });
    }
});

// Atualizar uma agenda
router.put("/agendas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { codTicket, data, hora, estado } = req.body;

        const agendaAtualizada = await prisma.agenda.update({
            where: { cod: id },
            data: {
                codTicket,
                data,
                hora,
                estado,
            },
        });

        res.status(200).json(agendaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar agenda." });
    }
});


// Deletar uma agenda
router.delete("/agendas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.agenda.delete({
            where: { cod: id },
        });

        res.status(200).json({ message: "Agenda deletada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar agenda." });
    }
});

// Filtrar agendas
router.get("/agendas", async (req, res) => {
    const { estado, dataInicio, dataFim } = req.query;

    // Validação das datas
    let parsedDataInicio = dataInicio ? new Date(dataInicio) : undefined;
    let parsedDataFim = dataFim ? new Date(dataFim) : undefined;

    if ((dataInicio && isNaN(parsedDataInicio)) || (dataFim && isNaN(parsedDataFim))) {
        return res.status(400).json({ message: "Datas fornecidas não são válidas." });
    }

    try {
        const agendas = await prisma.agenda.findMany({
            where: {
                estado: estado ? { contains: estado, mode: "insensitive" } : undefined,
                data: parsedDataInicio && parsedDataFim 
                    ? { 
                        gte: parsedDataInicio,
                        lte: parsedDataFim,
                    } 
                    : undefined,
            },
            select: {
                cod: true,  // Garante que o campo id (ou outro identificador) seja retornado
                estado: true, // Garante que o campo estado seja retornado
                data: true, // Garante que o campo data seja retornado
            },
            orderBy: { data: "asc" }, // Ordena por data
        });

        res.status(200).json({ data: agendas });
    } catch (error) {
        console.error("Erro ao listar agendas:", error);
        res.status(500).json({ message: "Erro no servidor ao filtrar agendas.", error: error.message });
    }
});





// #################################### ANEXOS ########################################################

// Criar um novo anexo
router.post("/anexos", async (req, res) => {
    try {
        const { codTicket, anexo } = req.body;

        const novoAnexo = await prisma.anexos.create({
            data: {
                codTicket,
                anexo,
            },
        });

        res.status(201).json(novoAnexo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar anexo." });
    }
});

// atualizar um anexo
router.put("/anexos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { codTicket, anexo } = req.body;

        const anexoAtualizado = await prisma.anexos.update({
            where: { cod: id },
            data: {
                codTicket,
                anexo,
            },
        });

        res.status(200).json(anexoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar anexo." });
    }
});


// Deletar um anexo
router.delete("/anexos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const anexo = await prisma.anexos.delete({   
            where: { cod: id },
        });

        res.status(200).json({ message: "Anexo deletado com sucesso!", anexo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar anexo." });
    }
});

// Filtrar anexos
router.get("/anexos", async (req, res) => {
    try {
        const { codTicket } = req.query;

        const anexos = await prisma.anexos.findMany({
            where: { codTicket },
        });

        res.status(200).json(anexos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao filtrar anexos." });
    }
});


// #################################### AVALIAÇÃO ########################################################

// Criar uma nova avaliação
router.post("/avaliacao", async (req, res) => {
    try {
        const { codUtilizador, avaliacao, comentario } = req.body;  // Definindo 'comentario' no corpo da requisição

        // Criando a nova avaliação
        const novaAvaliacao = await prisma.avaliacao.create({
            data: {
                codUtilizador,
                avaliacao,
                comentario,  // Salvando o comentário, se presente
            },
        });

        res.status(201).json(novaAvaliacao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar avaliação." });
    }
});

// Atualizar uma avaliação
router.put("/avaliacao/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { codUtilizador, avaliacao, comentario } = req.body;  // Definindo 'comentario' no corpo da requisição

        const avaliacaoAtualizada = await prisma.avaliacao.update({
            where: { cod: id },
            data: { 
                codUtilizador,
                avaliacao,
                comentario,  // Atualizando o comentário, se presente
            },  
        });

        res.status(200).json(avaliacaoAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar avaliação." });
    }
});

// Deletar uma avaliação
router.delete("/avaliacao/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const avaliacao = await prisma.avaliacao.delete({
            where: { cod: id },
        });

        res.status(200).json({ message: "Avaliação deletada com sucesso!", avaliacao });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar avaliação." });
    }
});

// Filtrar avaliações
router.get("/avaliacao", async (req, res) => {
    try {
        const { codUtilizador } = req.query;

        const avaliacoes = await prisma.avaliacao.findMany({
            where: { codUtilizador },
        });

        res.status(200).json(avaliacoes);
    } catch (error) {
        console.error(error);    
        res.status(500).json({ message: "Erro no servidor ao filtrar avaliações." });
    }
});

// #################################### CONFIGURANÇÃO ########################################################

// Criar uma nova configuração
router.post("/configuracoes", async (req, res) => {
    try {
        const { logoMarca, iconeMarca, corPadrao, corbotao, corMenu, somNotificacao, estado } = req.body;

        const novaConfiguracao = await prisma.configuracoes.create({
            data: { 
                logoMarca,  
                iconeMarca, 
                corPadrao, 
                corbotao, 
                corMenu, 
                somNotificacao, 
                estado,
            },
        });

        res.status(201).json(novaConfiguracao);
    } catch (error) {
        console.error(error);    
        res.status(500).json({ message: "Erro no servidor ao criar configuração." });
    }
});

// Atualizar uma configuração
router.put("/configuracoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { logoMarca, iconeMarca, corPadrao, corbotao, corMenu, somNotificacao, estado } = req.body;

        const configuracaoAtualizada = await prisma.configuracoes.update({
            where: { cod: id },
            data: { 
                logoMarca,  
                iconeMarca, 
                corPadrao, 
                corbotao, 
                corMenu, 
                somNotificacao, 
                estado,
            },
        });

        res.status(200).json(configuracaoAtualizada);
    } catch (error) {
        console.error(error);    
        res.status(500).json({ message: "Erro no servidor ao atualizar configuração." });
    }
});


// Deletar uma configuração
router.delete("/configuracoes/:id", async (req, res) => {
try {
const { id } = req.params;

const configuracao = await prisma.configuracoes.delete({    
where: { cod: id },
});

res.status(200).json({ message: "Configuração deletada com sucesso!", configuracao });
} catch (error) {
console.error(error);    
res.status(500).json({ message: "Erro no servidor ao deletar configuração." });
}
});

// Filtrar configurações
router.get("/configuracoes", async (req, res) => {
try {
const { estado } = req.query;   

const configuracoes = await prisma.configuracoes.findMany({
where: { estado },
});

res.status(200).json(configuracoes);
} catch (error) {
console.error(error);    
res.status(500).json({ message: "Erro no servidor ao filtrar configurações." });
}
});

// #################################### CONTRATOS ########################################################

// Criar um novo contrato
router.post("/contratos", async (req, res) => {
    try {
        const { codEmpresa, tipoContratos, periodoContrato, horas, horasAdicionais, descricao, dataInicio, dataFim, estado } = req.body;

        const novoContrato = await prisma.contrato.create({
            data: {
                codEmpresa,
                tipoContratos,
                periodoContrato,
                horas,
                horasAdicionais,
                descricao,
                dataInicio,
                dataFim,
                estado,
            },
        });

        res.status(201).json(novoContrato);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar contrato." });
    }
});

// Atualizar um contrato
router.put("/contratos/:id", async (req, res) => {
    const { id } = req.params;
    const { codEmpresa, tipoContratos, periodoContrato, horas, horasAdicionais, descricao, dataInicio, dataFim, estado } = req.body;

    try {
        const contratoAtualizado = await prisma.contrato.update({
            where: {
                cod: id,
            },
            data: {
                codEmpresa,
                tipoContratos,
                periodoContrato,
                horas,
                horasAdicionais,
                descricao,
                dataInicio,
                dataFim,
                estado,
            },
        });

        res.status(200).json(contratoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar contrato." });
    }
});

// Deletar um contrato existente
router.delete("/contratos/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const contratoDeletado = await prisma.contrato.delete({
            where: {
                cod: id,
            },
        });

        res.status(200).json({ message: "Contrato deletado com sucesso.", contratoDeletado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar contrato." });
    }
});


// Listar contratos com paginação (10 contratos por vez)
router.get("/contratos", async (req, res) => {
    const { page = 1 } = req.query; // Pega o número da página da query (padrão é 1)

    try {
        const contratos = await prisma.contrato.findMany({
            skip: (page - 1) * 10, // Pular os contratos das páginas anteriores
            take: 10,               // Limitar a 10 contratos por página
        });

        res.status(200).json(contratos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar contratos." });
    }
});


// Obter um contrato específico por id
router.get("/contratos/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const contrato = await prisma.contrato.findUnique({
            where: {
                cod: id,
            },
        });
        
        if (!contrato) {
            return res.status(404).json({ message: "Contrato não encontrado." });
        }

        res.status(200).json(contrato);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao obter o contrato." });
    }
});

// #################################### CONVERSAS ########################################################

// Criar uma nova conversa
router.post("/conversas", async (req, res) => {
    try {
        const { codTicket, codUtilizador, mensagem, anexos } = req.body;

        const novaConversa = await prisma.conversa.create({
            data: {
                codTicket,
                codUtilizador,
                mensagem,
                anexos,
            },
        });

        res.status(201).json(novaConversa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar conversa." });
    }
});

// Atualizar uma conversa
router.put("/conversas/:cod", async (req, res) => {
    const { cod } = req.params;
    const { mensagem, anexos } = req.body;

    try {
        const conversaAtualizada = await prisma.conversa.update({
            where: { cod },
            data: {
                mensagem,
                anexos,
            },
        });

        res.status(200).json(conversaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar conversa." });
    }
});

// Excluir uma conversa
router.delete("/conversas/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        await prisma.conversa.delete({
            where: { cod },
        });

        res.status(200).json({ message: "Conversa excluída com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao excluir conversa." });
    }
});

// Listar todas as conversas de um ticket
router.get("/conversas/:codTicket", async (req, res) => {
    const { codTicket } = req.params;

    try {
        const conversas = await prisma.conversa.findMany({
            where: { codTicket },
        });

        res.status(200).json(conversas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar conversas." });
    }
});

// Listar conversas com paginação (10 por vez)
router.get("/conversas", async (req, res) => {
    const { page = 1 } = req.query; // Pega o número da página da query (padrão é 1)

    try {
        const conversas = await prisma.conversa.findMany({
            skip: (page - 1) * 10, // Pular as conversas das páginas anteriores
            take: 10,               // Limitar a 10 conversas por página
        });

        res.status(200).json(conversas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar conversas." });
    }
});

// #################################### DEPARTAMENTOS ########################################################

// Criar um novo departamento
router.post("/departamentos", async (req, res) => {
    try {
        const { nome } = req.body;

        const novoDepartamento = await prisma.departamento.create({
            data: { nome },
        });

        res.status(201).json(novoDepartamento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar o departamento." });
    }
});

// Atualizar um departamento
router.put("/departamentos/:cod", async (req, res) => {
    const { cod } = req.params;
    const { nome } = req.body;

    try {
        const departamentoAtualizado = await prisma.departamento.update({
            where: { cod },
            data: { nome },
        });

        res.status(200).json(departamentoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar o departamento." });
    }
});


// Deletar um departamento
router.delete("/departamentos/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        await prisma.departamento.delete({
            where: { cod },
        });

        res.status(200).json({ message: "Departamento deletado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar o departamento." });
    }
});


// Buscar um departamento por código
router.get("/departamentos/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        const departamento = await prisma.departamento.findUnique({
            where: { cod },
        });

        if (!departamento) {
            return res.status(404).json({ message: "Departamento não encontrado." });
        }

        res.status(200).json(departamento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao buscar departamento." });
    }
});

//##################################### EMPRESA #######################################################

// Criar uma nova empresa
router.post("/empresas", async (req, res) => {
    try {
        const { nome, nif, logo, enderecos } = req.body;

        const novaEmpresa = await prisma.empresa.create({
            data: {
                nome,
                nif,
                logo,
                enderecos,
            },
        });

        res.status(201).json(novaEmpresa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar a empresa." });
    }
});



// Buscar uma empresa por código
router.get("/empresas/:cod", async (req, res) => {
    const { cod } = req.params;

    // Verificar se o código está definido
    if (!cod) {
        return res.status(400).json({ message: "O código da empresa é obrigatório." });
    }

    try {
        // Buscar diretamente com cod como string
        const empresa = await prisma.empresa.findUnique({
            where: { cod },
        });

        if (!empresa) {
            return res.status(404).json({ message: "Empresa não encontrada." });
        }

        res.status(200).json(empresa);
    } catch (error) {
        console.error("Erro no servidor ao buscar empresa:", error.message);
        res.status(500).json({ message: "Erro no servidor ao buscar empresa." });
    }
});





// Atualizar uma empresa
router.put("/empresas/:cod", async (req, res) => {
    const { cod } = req.params;
    const { nome, nif, logo, enderecos } = req.body;

    try {
        const empresaAtualizada = await prisma.empresa.update({
            where: { cod },
            data: { nome, nif, logo, enderecos },
        });

        res.status(200).json(empresaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar a empresa." });
    }
});


// Deletar uma empresa
router.delete("/empresas/:cod", async (req, res) => {
const { cod } = req.params;

try {
await prisma.empresa.delete({
where: { cod },
});

res.status(200).json({ message: "Empresa deletada com sucesso." });
} catch (error) {
console.error(error);
res.status(500).json({ message: "Erro no servidor ao deletar a empresa." });
}
});


//##################################### FUNÇÃO #######################################################

// Criar uma nova função
router.post("/funcoes", async (req, res) => {
    try {
        const { nome } = req.body;

        const novaFuncao = await prisma.funcao.create({
            data: { nome },
        });

        res.status(201).json(novaFuncao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar a função." });
    }
});



// Buscar uma função por código
router.get("/funcoes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        const funcao = await prisma.funcao.findUnique({
            where: { cod },
        });

        if (!funcao) {
            return res.status(404).json({ message: "Função não encontrada." });
        }

        res.status(200).json(funcao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao buscar função." });
    }
});


// Atualizar uma função
router.put("/funcoes/:cod", async (req, res) => {
    const { cod } = req.params;
    const { nome } = req.body;

    try {
        const funcaoAtualizada = await prisma.funcao.update({
            where: { cod },
            data: { nome },
        });

        res.status(200).json(funcaoAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar a função." });
    }
});

// Deletar uma função
router.delete("/funcoes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        await prisma.funcao.delete({
            where: { cod },
        });

        res.status(200).json({ message: "Função deletada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar a função." });
    }
});


//##################################### NOTIFICAÇÕES #######################################################

// Criar uma nova notificação
router.post("/notificacoes", async (req, res) => {
    try {
        const { codUtilizador, assunto, descricao, estado } = req.body;

        const novaNotificacao = await prisma.notificacao.create({
            data: { 
                codUtilizador, 
                assunto, 
                descricao, 
                estado, 
            },
        });

        res.status(201).json(novaNotificacao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar a notificação." });
    }
});


// Listar todas as notificações
router.get("/notificacoes", async (req, res) => {
    try {
        const notificacoes = await prisma.notificacao.findMany();
        res.status(200).json(notificacoes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar notificações." });
    }
});

// Buscar uma notificação por código
router.get("/notificacoes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        const notificacao = await prisma.notificacao.findUnique({
            where: { cod },
        });

        if (!notificacao) {
            return res.status(404).json({ message: "Notificação não encontrada." });
        }

        res.status(200).json(notificacao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao buscar a notificação." });
    }
});


// Atualizar uma notificação
router.put("/notificacoes/:cod", async (req, res) => {
    const { cod } = req.params;
    const { codUtilizador, assunto, descricao } = req.body;

    try {
        const notificacaoAtualizada = await prisma.notificacao.update({
            where: { cod },
            data: { codUtilizador, assunto, descricao },
        });

        res.status(200).json(notificacaoAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar a notificação." });
    }
});

// Deletar uma notificação
router.delete("/notificacoes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        await prisma.notificacao.delete({
            where: { cod },
        });

        res.status(200).json({ message: "Notificação deletada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar a notificação." });
    }
});


// ##################################### PENDENTES #######################################################

// Criar um novo pendente
router.post("/pendentes", async (req, res) => {
    try {
        const { codTicket, codRelatorio, descricao, estado } = req.body;

        const novoPendente = await prisma.pendente.create({
            data: { 
                codTicket, 
                codRelatorio, 
                descricao, 
                estado 
            },
        });

        res.status(201).json(novoPendente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar o pendente." });
    }
});

// Listar todos os pendentes
router.get("/pendentes", async (req, res) => {
    try {
        const pendentes = await prisma.pendente.findMany();
        res.status(200).json(pendentes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar pendentes." });
    }
});


// Buscar um pendente por código
router.get("/pendentes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        const pendente = await prisma.pendente.findUnique({
            where: { cod },
        });

        if (!pendente) {
            return res.status(404).json({ message: "Pendente não encontrado." });
        }

        res.status(200).json(pendente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao buscar o pendente." });
    }
});


// Atualizar um pendente
router.put("/pendentes/:cod", async (req, res) => {
    const { cod } = req.params;
    const { codTicket, codRelatorio, descricao, estado } = req.body;

    try {
        const pendenteAtualizado = await prisma.pendente.update({
            where: { cod },
            data: { codTicket, codRelatorio, descricao, estado },
        });

        res.status(200).json(pendenteAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar o pendente." });
    }
});


// Deletar um pendente
router.delete("/pendentes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        await prisma.pendente.delete({
            where: { cod },
        });

        res.status(200).json({ message: "Pendente deletado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar o pendente." });
    }
});

// ##################################### PERGUNTAS-FREQUENTES #######################################################

// Criar uma nova pergunta frequente
router.post("/perguntas-frequentes", async (req, res) => {
    try {
        const { pergunta, resposta } = req.body;

        const novaPergunta = await prisma.perguntasFrequentes.create({
            data: {
                pergunta,
                resposta,
            },
        });

        res.status(201).json(novaPergunta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar pergunta frequente." });
    }
});

// Listar todas as perguntas frequentes
router.get("/perguntas-frequentes", async (req, res) => {
    try {
        const perguntasFrequentes = await prisma.perguntasFrequentes.findMany();
        res.status(200).json(perguntasFrequentes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar perguntas frequentes." });
    }
});

// Buscar uma pergunta frequente por código
router.get("/perguntas-frequentes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        const pergunta = await prisma.perguntasFrequentes.findUnique({
            where: { cod },
        });

        if (!pergunta) {
            return res.status(404).json({ message: "Pergunta frequente não encontrada." });
        }

        res.status(200).json(pergunta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao buscar pergunta frequente." });
    }
});

// Atualizar uma pergunta frequente
router.put("/perguntas-frequentes/:cod", async (req, res) => {
    const { cod } = req.params;
    const { pergunta, resposta } = req.body;

    try {
        const perguntaAtualizada = await prisma.perguntasFrequentes.update({
            where: { cod },
            data: { pergunta, resposta },
        });

        res.status(200).json(perguntaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar pergunta frequente." });
    }
});

// Deletar uma pergunta frequente
router.delete("/perguntas-frequentes/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        await prisma.perguntasFrequentes.delete({
            where: { cod },
        });

        res.status(200).json({ message: "Pergunta frequente deletada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar pergunta frequente." });
    }
});

// ##################################### RELATORIO #######################################################

// Criar um novo relatório
router.post("/relatorios", async (req, res) => {
    try {
        const {
            codTicket,
            resolucao,
            horaInicio,
            horaFim,
            versaoSql,
            instancia,
            servidor,
            nPostos,
            avServidor,
            avPostos,
            bkExterno,
            resolucaoCliente,
            tecnicoAuxiliar,
            aprovacao,
            dataAprovacao
        } = req.body;

        const novoRelatorio = await prisma.relatorio.create({
            data: {
                codTicket,
                resolucao,
                horaInicio: new Date(horaInicio),
                horaFim: new Date(horaFim),
                versaoSql,
                instancia,
                servidor,
                nPostos,
                avServidor,
                avPostos,
                bkExterno,
                resolucaoCliente,
                tecnicoAuxiliar,
                aprovacao,
                dataAprovacao: dataAprovacao ? new Date(dataAprovacao) : null,
            },
        });

        res.status(201).json(novoRelatorio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar relatório." });
    }
});

// Listar todos os relatórios
router.get("/relatorios", async (req, res) => {
    try {
        const relatorios = await prisma.relatorio.findMany({
            orderBy: { dataCriacao: 'desc' },
            take: 10, // Exibe os 10 mais recentes
        });

        res.status(200).json(relatorios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar relatórios." });
    }
});


// Buscar um relatório por código
router.get("/relatorios/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        const relatorio = await prisma.relatorio.findUnique({
            where: { cod },
        });

        if (!relatorio) {
            return res.status(404).json({ message: "Relatório não encontrado." });
        }

        res.status(200).json(relatorio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao buscar relatório." });
    }
});


// Atualizar um relatório
router.put("/relatorios/:cod", async (req, res) => {
    const { cod } = req.params;
    const {
        codTicket,
        resolucao,
        horaInicio,
        horaFim,
        versaoSql,
        instancia,
        servidor,
        nPostos,
        avServidor,
        avPostos,
        bkExterno,
        resolucaoCliente,
        tecnicoAuxiliar,
        aprovacao,
        dataAprovacao
    } = req.body;

    try {
        const relatorioAtualizado = await prisma.relatorio.update({
            where: { cod },
            data: {
                codTicket,
                resolucao,
                horaInicio: new Date(horaInicio),
                horaFim: new Date(horaFim),
                versaoSql,
                instancia,
                servidor,
                nPostos,
                avServidor,
                avPostos,
                bkExterno,
                resolucaoCliente,
                tecnicoAuxiliar,
                aprovacao,
                dataAprovacao: dataAprovacao ? new Date(dataAprovacao) : null,
            },
        });

        res.status(200).json(relatorioAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar relatório." });
    }
});

// Deletar um relatório
router.delete("/relatorios/:cod", async (req, res) => {
    const { cod } = req.params;

    try {
        await prisma.relatorio.delete({
            where: { cod },
        });

        res.status(200).json({ message: "Relatório deletado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar relatório." });
    }
});

//############################################################# TICKETS   ##################################################################


// Criar um novo Ticket
router.post("/tickets", async (req, res) => {
    try {
        const {
            codCliente,
            codTecnico,
            codEmpresa,
            assunto,
            descricao,
            prioridade,
            departamento,
            produto,
            tipoAssistencia,
            estado,
            dataPrevista,
            dataExecutada,
            dataFecho
        } = req.body;

        const ticket = await prisma.ticket.create({
            data: {
                codCliente,
                codTecnico,
                codEmpresa,
                assunto,
                descricao,
                prioridade,
                departamento,
                produto,
                tipoAssistencia,
                estado,
                dataPrevista: dataPrevista ? new Date(dataPrevista) : null,
                dataExecutada: dataExecutada ? new Date(dataExecutada) : null,
                dataFecho: dataFecho ? new Date(dataFecho) : null,
            },
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao criar o ticket." });
    }
});

// Atualizar um Ticket
router.put("/tickets/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            codCliente,
            codTecnico,
            codEmpresa,
            assunto,
            descricao,
            prioridade,
            departamento,
            produto,
            tipoAssistencia,
            estado,
            dataPrevista,
            dataExecutada,
            dataFecho
        } = req.body;

        const ticketAtualizado = await prisma.ticket.update({
            where: { cod: id },
            data: {
                codCliente,
                codTecnico,
                codEmpresa,
                assunto,
                descricao,
                prioridade,
                departamento,
                produto,
                tipoAssistencia,
                estado,
                dataPrevista: dataPrevista ? new Date(dataPrevista) : null,
                dataExecutada: dataExecutada ? new Date(dataExecutada) : null,
                dataFecho: dataFecho ? new Date(dataFecho) : null,
            },
        });

        res.status(200).json(ticketAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao atualizar o ticket." });
    }
});

// Deletar um Ticket
router.delete("/tickets/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.ticket.delete({
            where: { cod: id },
        });

        res.status(200).json({ message: "Ticket deletado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao deletar o ticket." });
    }
});

// Listar Tickets com Filtros
router.get("/tickets", async (req, res) => {
    try {
        const {
            codCliente,
            codEmpresa,
            prioridade,
            estado,
            departamento,
            dataInicio,
            dataFim
        } = req.query;

        const filtros = {};

        if (codCliente) filtros.codCliente = codCliente;
        if (codEmpresa) filtros.codEmpresa = codEmpresa;
        if (prioridade) filtros.prioridade = prioridade;
        if (estado) filtros.estado = estado;
        if (departamento) filtros.departamento = departamento;
        if (dataInicio && dataFim) {
            filtros.dataCriacao = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim),
            };
        }

        const tickets = await prisma.ticket.findMany({
            where: filtros,
            orderBy: { dataCriacao: "desc" },
        });

        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao listar tickets." });
    }
});

//############################################################# UTILIZADORES   ##################################################################

// Deletar um utilizador
router.delete("/utilizadores/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const utilizador = await prisma.utilizador.delete({
            where: { cod: id },
        });

        res.status(200).json({ message: "Utilizador deletado com sucesso!", utilizador });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor." });
    }
});


// Atualizar um utilizador
router.put("/utilizadores/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.senha) {
            const salt = await bcrypt.genSalt(10);
            data.senha = await bcrypt.hash(data.senha, salt);
        }

        const utilizador = await prisma.utilizador.update({
            where: { cod: id },
            data,
        });

        res.status(200).json(utilizador);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor." });
    }
});


// Buscar todos os utilizadores com paginação e limite
router.get("/utilizadores", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Parâmetros de paginação
        const pageNumber = parseInt(page, 10); // Converte para número
        const pageSize = parseInt(limit, 10); // Converte para número

        if (pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Página e limite devem ser maiores que zero." });
        }

        const totalUtilizadores = await prisma.utilizador.count(); // Total de utilizadores no banco
        const utilizadores = await prisma.utilizador.findMany({
            skip: (pageNumber - 1) * pageSize, // Ignora os registros das páginas anteriores
            take: pageSize, // Quantidade de registros por página
        });

        const totalPages = Math.ceil(totalUtilizadores / pageSize); // Total de páginas

        res.status(200).json({
            total: totalUtilizadores,
            page: pageNumber,
            limit: pageSize,
            totalPages,
            data: utilizadores,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor." });
    }
});


// Buscar todos os tipos de utilizadores
router.get("/tipos-utilizadores", async (req, res) => {
    try {
        const tiposUtilizadores = await prisma.utilizador.groupBy({
            by: ["tipoUtilizador"], // Agrupa pelos tipos de utilizadores
        });

        const tipos = tiposUtilizadores.map(item => item.tipoUtilizador); // Extrai apenas os tipos

        res.status(200).json({ tipos });
    } catch (error) {
        console.error("Erro ao buscar tipos de utilizadores:", error);
        res.status(500).json({ message: "Erro no servidor." });
    }
});


export default router;
