import express from 'express';
import { getConnection } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * GET /api/convite/:slug
 * Retorna dados completos do convite (público)
 * Validação: Se slug não existe, retorna 404
 */
router.get('/convite/:slug', async (req, res) => {
  const { slug } = req.params;

  if (!slug || slug.length !== 6) {
    return res.status(400).json({
      success: false,
      message: 'Slug inválido',
    });
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT id, slug, nome_exibicao, tipo, confirmado_presenca, categoria FROM convidados WHERE slug = ?',
      [slug.toUpperCase()]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Convite não encontrado',
        statusCode: 404,
      });
    }

    const guest = rows[0];
    res.status(200).json({
      success: true,
      data: {
        id: guest.id,
        slug: guest.slug,
        nomeExibicao: guest.nome_exibicao,
        tipo: guest.tipo,
        confirmadoPresenca: guest.confirmado_presenca === 1,
        categoria: guest.categoria,
        coupleNames: {
          name1: process.env.COUPLE_NAME_1 || 'Os Noivos',
          name2: process.env.COUPLE_NAME_2 || '',
        },
        coupleImage: process.env.COUPLE_IMAGE_URL,
        eventDetails: {
          date: process.env.EVENT_DATE || '2026-06-15',
          time: process.env.EVENT_TIME || '15:00',
          location: process.env.EVENT_LOCATION || 'Local do Evento',
          timeline: [
            { time: '15:00', event: 'Recepção' },
            { time: '16:30', event: 'Cerimônia' },
            { time: '18:00', event: 'Buffet' },
            { time: '22:00', event: 'Corte do Bolo' },
          ],
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar convite:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar requisição',
    });
  }
});

/**
 * PUT /api/convite/:slug/confirmar
 * Confirma presença no evento
 */
router.put('/convite/:slug/confirmar', async (req, res) => {
  const { slug } = req.params;

  if (!slug || slug.length !== 6) {
    return res.status(400).json({
      success: false,
      message: 'Slug inválido',
    });
  }

  try {
    const connection = await getConnection();

    // Verificar se convite existe
    const [guest] = await connection.execute(
      'SELECT id, confirmado_presenca FROM convidados WHERE slug = ?',
      [slug.toUpperCase()]
    );

    if (guest.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Convite não encontrado',
      });
    }

    // Atualizar status de confirmação
    await connection.execute(
      'UPDATE convidados SET confirmado_presenca = 1, updated_at = NOW() WHERE slug = ?',
      [slug.toUpperCase()]
    );

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Presença confirmada com sucesso!',
      data: {
        slug: slug.toUpperCase(),
        confirmadoPresenca: true,
      },
    });
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar requisição',
    });
  }
});

export default router;
