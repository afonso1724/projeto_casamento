import express from 'express';
import { getConnection } from '../config/database.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// ==================== MIDDLEWARE DE AUTENTICAÇÃO ====================
const authMiddleware = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'] || req.query.adminToken;
  const expectedToken = process.env.ADMIN_TOKEN || 'admin-secret-2026';

  if (!adminToken || adminToken !== expectedToken) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. Token inválido ou ausente.',
    });
  }

  next();
};

// ==================== GERAR SLUG ÚNICO ====================
async function gerarSlugUnico(connection) {
  let slug;
  let unique = false;

  while (!unique) {
    slug = nanoid(6).toUpperCase();
    const [existing] = await connection.execute(
      'SELECT id FROM convidados WHERE slug = ?',
      [slug]
    );
    if (existing.length === 0) {
      unique = true;
    }
  }

  return slug;
}

// ==================== GET /api/admin/convidados - Listar todos os convidados ====================
router.get('/admin/convidados', authMiddleware, async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT id, slug, nome_exibicao, tipo, confirmado_presenca, categoria, created_at FROM convidados ORDER BY created_at DESC'
    );
    connection.release();

    res.status(200).json({
      success: true,
      total: rows.length,
      data: rows.map(guest => ({
        id: guest.id,
        slug: guest.slug,
        nomeExibicao: guest.nome_exibicao,
        tipo: guest.tipo,
        confirmadoPresenca: guest.confirmado_presenca === 1,
        categoria: guest.categoria,
        criadoEm: guest.created_at,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar requisição',
    });
  }
});

// ==================== GET /api/admin/convidados/busca - Buscar convidados ====================
router.get('/admin/convidados/busca', authMiddleware, async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Termo de busca deve ter ao menos 2 caracteres',
    });
  }

  try {
    const connection = await getConnection();
    const searchTerm = `%${q}%`;
    const [rows] = await connection.execute(
      'SELECT id, slug, nome_exibicao, tipo, confirmado_presenca FROM convidados WHERE nome_exibicao LIKE ? ORDER BY nome_exibicao LIMIT 20',
      [searchTerm]
    );
    connection.release();

    res.status(200).json({
      success: true,
      data: rows.map(guest => ({
        id: guest.id,
        slug: guest.slug,
        nomeExibicao: guest.nome_exibicao,
        tipo: guest.tipo,
        confirmadoPresenca: guest.confirmado_presenca === 1,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar busca',
    });
  }
});

// ==================== POST /api/admin/convidados - Criar novo convidado ====================
router.post('/admin/convidados', authMiddleware, async (req, res) => {
  const { nomeExibicao, tipo = 'Individual', categoria = 'convidado' } = req.body;

  // Validações
  if (!nomeExibicao || nomeExibicao.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Nome de exibição é obrigatório',
    });
  }

  if (!['Individual', 'Casal'].includes(tipo)) {
    return res.status(400).json({
      success: false,
      message: 'Tipo deve ser "Individual" ou "Casal"',
    });
  }

  try {
    const connection = await getConnection();

    // Verificar se já existe convidado com o mesmo nome
    const [existingGuest] = await connection.execute(
      'SELECT id FROM convidados WHERE LOWER(TRIM(nome_exibicao)) = LOWER(TRIM(?))',
      [nomeExibicao.trim()]
    );

    if (existingGuest.length > 0) {
      connection.release();
      return res.status(409).json({
        success: false,
        message: 'Já existe um convidado com este nome cadastrado',
      });
    }

    // Gerar slug único
    const slug = await gerarSlugUnico(connection);

    // Inserir convidado
    await connection.execute(
      'INSERT INTO convidados (slug, nome_exibicao, tipo, categoria, confirmado_presenca) VALUES (?, ?, ?, ?, 0)',
      [slug, nomeExibicao.trim(), tipo, categoria]
    );

    connection.release();

    // Gerar URL do convite
    const conviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/convite/${slug}`;

    res.status(201).json({
      success: true,
      message: 'Convidado criado com sucesso',
      data: {
        id: null,
        slug: slug,
        nomeExibicao: nomeExibicao.trim(),
        tipo: tipo,
        conviteUrl: conviteUrl,
      },
    });
  } catch (error) {
    console.error('Erro ao criar convidado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar requisição',
    });
  }
});

/**
 * PUT /api/admin/convidados/:id
 * Atualiza dados do convidado
 */
router.put('/admin/convidados/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nomeExibicao, tipo, categoria } = req.body;

  if (!nomeExibicao && !tipo && !categoria) {
    return res.status(400).json({
      success: false,
      message: 'Pelo menos um campo deve ser fornecido para atualização',
    });
  }

  try {
    const connection = await getConnection();

    const updates = [];
    const values = [];

    if (nomeExibicao) {
      updates.push('nome_exibicao = ?');
      values.push(nomeExibicao.trim());
    }
    if (tipo) {
      if (!['Individual', 'Casal'].includes(tipo)) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Tipo deve ser "Individual" ou "Casal"',
        });
      }
      updates.push('tipo = ?');
      values.push(tipo);
    }
    if (categoria) {
      updates.push('categoria = ?');
      values.push(categoria);
    }

    values.push(id);

    const [result] = await connection.execute(
      `UPDATE convidados SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Convidado não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Convidado atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar requisição',
    });
  }
});

/**
 * DELETE /api/admin/convidados/:id
 * Deleta um convidado
 */
router.delete('/admin/convidados/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM convidados WHERE id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Convidado não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Convidado deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar convidado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar requisição',
    });
  }
});

/**
 * GET /api/admin/stats
 * Retorna estatísticas de convidados
 */
router.get('/admin/stats', authMiddleware, async (req, res) => {
  try {
    const connection = await getConnection();

    const [totalResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM convidados'
    );

    const [confirmadosResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM convidados WHERE confirmado_presenca = 1'
    );

    const [tiposResult] = await connection.execute(
      'SELECT tipo, COUNT(*) as total FROM convidados GROUP BY tipo'
    );

    connection.release();

    res.status(200).json({
      success: true,
      data: {
        totalConvidados: totalResult[0].total,
        confirmados: confirmadosResult[0].total,
        porTipo: tiposResult.reduce((acc, row) => {
          acc[row.tipo] = row.total;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar requisição',
    });
  }
});

export default router;
