import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client' 
import jwt from 'jsonwebtoken' // Biblioteca para gerar tokens


const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

// Autenticar um utilizador
router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validação dos campos
        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        // Buscar o utilizador pelo email
        const user = await prisma.utilizador.findUnique({
            where: { email: email },
        });

        if (!user) {
            // Resposta genérica para não expor se o usuário existe ou não
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }

        // Verificar se a senha está correta
        const passwordMatch = await bcrypt.compare(senha, user.senha);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }

        // Gerar token JWT (expira em 1 hora)
        const token = jwt.sign(
            { id: user.cod, email: user.email, tipoUtilizador: user.tipoUtilizador, foto: user.fotoPerfil, empresa: user.empresa, funcao: user.funcao },
            process.env.JWT_SECRET, // Certifique-se de definir JWT_SECRET no .env
            { expiresIn: "1d" }
        );

        // Retornar apenas dados necessários
        res.status(200).json({
            message: "Login bem-sucedido.",
            token: token,
            user: {
                cod: user.cod,
                nome: user.nome,
                email: user.email,
                tipoUtilizador: user.tipoUtilizador,
                foto: user.fotoPerfil,
                empresa: user.empresa,
                funcao: user.funcao
            },
        });
    } catch (error) {
        console.error("Erro ao autenticar utilizador:", error);
        res.status(500).json({ message: "Erro no servidor ao autenticar utilizador." });
    }
});




//############################################################# UTILIZADORES   ##################################################################

router.post("/utilizadores", async (req, res) => {
    try {
        const {
            email, nome, telefone, genero, dataNascimento,
            empresa, departamento, funcao, tipoUtilizador,
            senha, fotoPerfil, termoUso, estado,
        } = req.body;

        // ⚠️ Verificar se o e-mail já existe
        const existingUser = await prisma.utilizador.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "E-mail já está em uso." });
        }

        // 🔒 Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // 📝 Criar o utilizador
        const utilizador = await prisma.utilizador.create({
            data: {
                email,
                nome,
                telefone,
                genero,
                dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
                empresa,
                departamento,
                funcao,
                tipoUtilizador,
                senha: senhaHash,
                fotoPerfil,
                termoUso,
                estado,
            },
        });

        res.status(201).json(utilizador);
    } catch (error) {
        console.error("Erro ao criar utilizador:", error);

        if (error.code === 'P2002') {
            return res.status(400).json({ message: "E-mail já está em uso." });
        }

        res.status(500).json({ message: "Erro no servidor." });
    }
});


// Listar todas as empresas
router.get("/empresas", async (req, res) => {
    const { nome, nif, endereco } = req.query;
  
    try {
      const empresas = await prisma.empresa.findMany({
        where: {
          nome: nome ? { contains: nome, mode: "insensitive" } : undefined,
          nif: nif ? { contains: nif } : undefined,
          enderecos: endereco
            ? { contains: endereco, mode: "insensitive" }
            : undefined,
        },
        select: {
          cod: true,   // Garante que o campo id é retornado
          nome: true, // Garante que o campo nome é retornado
        },
      });
      res.status(200).json({ data: empresas });
    } catch (error) {
      console.error("Erro ao listar empresas:", error);
      res.status(500).json({ message: "Erro no servidor ao listar empresas." });
    }
  });

  // Listar todos os departamentos
router.get("/departamentos", async (req, res) => {
    const { nome} = req.query;
  
    try {
      const departamentos = await prisma.departamento.findMany({
        where: {
          nome: nome ? { contains: nome, mode: "insensitive" } : undefined,
        },
        select: {
          cod: true,   // Retorna o ID único do departamento
          nome: true, // Retorna o nome do departamento
        },
      });
      res.status(200).json({ data: departamentos });
    } catch (error) {
      console.error("Erro ao listar departamentos:", error);
      res.status(500).json({ message: "Erro no servidor ao listar departamentos." });
    }
  });
  
  // Listar todas as funções
router.get("/funcoes", async (req, res) => {
    const { nome } = req.query;
  
    try {
      const funcoes = await prisma.funcao.findMany({
        where: {
          nome: nome ? { contains: nome, mode: "insensitive" } : undefined,
        },
        select: {
          cod: true,   // Retorna o ID único da função
          nome: true, // Retorna o nome da função
        },
      });
      res.status(200).json({ data: funcoes });
    } catch (error) {
      console.error("Erro ao listar funções:", error);
      res.status(500).json({ message: "Erro no servidor ao listar funções." });
    }
  });
  



export default router;