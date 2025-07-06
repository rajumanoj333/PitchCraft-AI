// Add to server.js (backend)
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';
import textToSpeech from '@google-cloud/text-to-speech';
import ffmpeg from 'fluent-ffmpeg';

const resend = new Resend(process.env.RESEND_API_KEY);
const client = new textToSpeech.TextToSpeechClient();

// PDF Export
app.get('/export/pdf/:projectId', async (req, res) => {
  try {
    const project = await getProjectFromDB(req.params.projectId);
    const pdfDoc = await PDFDocument.create();
    
    // Add slides to PDF
    for (const slide of project.slides) {
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 24;
      
      page.drawText(slide.title, {
        x: 50,
        y: height - 50,
        size: fontSize,
        font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      });
      
      page.drawText(slide.content, {
        x: 50,
        y: height - 100,
        size: fontSize - 4,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBytes);
  } catch (error) {
    res.status(500).send('PDF generation failed');
  }
});

// Email Export
app.post('/export/email/:projectId', async (req, res) => {
  try {
    const { email } = req.body;
    const project = await getProjectFromDB(req.params.projectId);
    
    await resend.emails.send({
      from: 'pitchcraft@resend.dev',
      to: email,
      subject: `Pitch Deck: ${project.idea}`,
      html: `<h1>${project.idea}</h1><p>See attached pitch deck</p>`,
      attachments: [{
        filename: 'pitch-deck.pdf',
        content: await generatePDFBuffer(project) // Reuse PDF generator
      }]
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Email sending failed' });
  }
});

// Video Export
app.get('/export/video/:projectId', async (req, res) => {
  try {
    const project = await getProjectFromDB(req.params.projectId);
    const audioFiles = [];
    
    // Generate audio for each slide
    for (const [index, slide] of project.slides.entries()) {
      const [response] = await client.synthesizeSpeech({
        input: { text: `${slide.title}. ${slide.content}` },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      });
      
      const audioPath = `./temp/slide-${index}.mp3`;
      fs.writeFileSync(audioPath, response.audioContent, 'binary');
      audioFiles.push(audioPath);
    }
    
    // Combine audio with slides
    const videoPath = `./temp/pitch-${Date.now()}.mp4`;
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input('pattern:color=white:size=1280x720')
        .inputFPS(1)
        .loop(audioFiles.length)
        .complexFilter([
          ...audioFiles.map((_, i) => `[0:v]drawtext=text='Slide ${i+1}':fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2[v${i}]`),
          ...audioFiles.map((_, i) => `[v${i}]`),
          `concat=n=${audioFiles.length}:v=1:a=0[outv]`
        ])
        .outputOptions([
          ...audioFiles.map((file, i) => `-i ${file}`),
          '-filter_complex', `concat=n=${audioFiles.length}:v=0:a=1[outa]`
        ])
        .map('[outv]')
        .map('[outa]')
        .save(videoPath)
        .on('end', resolve)
        .on('error', reject);
    });
    
    res.sendFile(videoPath, () => fs.unlinkSync(videoPath));
  } catch (error) {
    res.status(500).send('Video generation failed');
  }
});