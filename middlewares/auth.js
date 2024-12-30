import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    
const Token = req.headers.authorization;

if (!Token) {
  return res.status(401).json({ message: "Acesso negado. Token nao fornecido." });
}

try {
  // Verifica e decodifica o token
  const decoded = jwt.verify(Token.replace("Bearer ", ""), JWT_SECRET); // O segredo vem das variáveis de ambiente
  req.user = decoded; // Armazena os dados do usuário decodificados no objeto `req`
  next(); // Prossegue para a próxima função
} catch (error) {
  res.status(401).json({ message: "Token invalido ou expirado." });
}


} 

/*
const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]; // O token será enviado no cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // O segredo vem das variáveis de ambiente
        req.user = decoded; // Armazena os dados do usuário decodificados no objeto `req`
        next(); // Prossegue para a próxima função
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};
*/
export default authMiddleware;
