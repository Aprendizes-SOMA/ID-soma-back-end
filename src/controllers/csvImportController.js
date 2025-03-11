const csvImportService = require('../services/csvImportService');

exports.importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    await csvImportService.processCSV(req.file.path);

    res.json({ message: 'CSV importado com sucesso.' });
  } catch (error) {
    console.error("Erro na importação CSV:", error);
    res.status(500).json({ error: 'Erro na importação CSV.' });
  }
};
