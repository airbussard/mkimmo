import { Metadata } from 'next'
import { COMPANY_INFO } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung der Möller & Knabe GbR gemäß DSGVO.',
}

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto prose prose-slate">
        <h1>Datenschutzerklärung</h1>

        <h2>1. Datenschutz auf einen Blick</h2>

        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten
          sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche
          Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten
          Datenschutzerklärung.
        </p>

        <h3>Datenerfassung auf dieser Website</h3>
        <p>
          <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
        </p>
        <p>
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
          Kontaktdaten können Sie dem Abschnitt &bdquo;Hinweis zur Verantwortlichen Stelle&ldquo; in dieser
          Datenschutzerklärung entnehmen.
        </p>

        <p>
          <strong>Wie erfassen wir Ihre Daten?</strong>
        </p>
        <p>
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es
          sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
        </p>
        <p>
          Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch
          unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser,
          Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt
          automatisch, sobald Sie diese Website betreten.
        </p>

        <p>
          <strong>Wofür nutzen wir Ihre Daten?</strong>
        </p>
        <p>
          Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
          gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
        </p>

        <p>
          <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong>
        </p>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
          Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
          Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
          Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft
          widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der
          Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein
          Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
        </p>

        <h2>2. Hosting</h2>
        <p>
          Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
        </p>
        <p>
          Die Website wird auf einem Server in Deutschland gehostet. Weitere Informationen entnehmen
          Sie der Datenschutzerklärung des Hosting-Anbieters.
        </p>

        <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>

        <h3>Datenschutz</h3>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
          behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>

        <h3>Hinweis zur verantwortlichen Stelle</h3>
        <p>
          Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
        </p>
        <p>
          {COMPANY_INFO.name}
          <br />
          {COMPANY_INFO.strasse}
          <br />
          {COMPANY_INFO.plz} {COMPANY_INFO.ort}
        </p>
        <p>
          Telefon: {COMPANY_INFO.telefon}
          <br />
          E-Mail: {COMPANY_INFO.email}
        </p>

        <h3>Speicherdauer</h3>
        <p>
          Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde,
          verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung
          entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur
          Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich
          zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.
        </p>

        <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
        <p>
          Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie
          können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis
          zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
        </p>

        <h3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
        <p>
          Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer
          Aufsichtsbehörde zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungs-
          rechtlicher oder gerichtlicher Rechtsbehelfe.
        </p>

        <h3>Recht auf Datenübertragbarkeit</h3>
        <p>
          Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines
          Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen,
          maschinenlesbaren Format aushändigen zu lassen.
        </p>

        <h3>Auskunft, Löschung und Berichtigung</h3>
        <p>
          Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
          unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und
          Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder
          Löschung dieser Daten.
        </p>

        <h2>4. Datenerfassung auf dieser Website</h2>

        <h3>Cookies</h3>
        <p>
          Unsere Internetseiten verwenden so genannte &bdquo;Cookies&ldquo;. Cookies sind kleine Datenpakete und
          richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer
          einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät
          gespeichert.
        </p>
        <p>
          Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert
          werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle
          oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des
          Browsers aktivieren.
        </p>

        <h3>Kontaktformular</h3>
        <p>
          Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
          Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
          Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht
          ohne Ihre Einwilligung weiter.
        </p>

        <h2>5. Google Consent Mode v2</h2>
        <p>
          Diese Website verwendet den Google Consent Mode v2. Dieser ermöglicht es uns, Ihre
          Einwilligung für verschiedene Kategorien von Cookies und Tracking-Technologien einzuholen und
          zu verwalten. Erst nach Ihrer ausdrücklichen Einwilligung werden entsprechende Cookies
          gesetzt oder Tracking-Technologien aktiviert.
        </p>
        <p>
          Sie können Ihre Einwilligung jederzeit über den Cookie-Banner widerrufen oder anpassen.
        </p>

        <h2>6. Ihre Betroffenenrechte</h2>
        <p>
          Unter den angegebenen Kontaktdaten können Sie jederzeit folgende Rechte ausüben:
        </p>
        <ul>
          <li>Auskunft über Ihre bei uns gespeicherten Daten und deren Verarbeitung (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger personenbezogener Daten (Art. 16 DSGVO)</li>
          <li>Löschung Ihrer bei uns gespeicherten Daten (Art. 17 DSGVO)</li>
          <li>
            Einschränkung der Datenverarbeitung, sofern wir Ihre Daten aufgrund gesetzlicher Pflichten
            noch nicht löschen dürfen (Art. 18 DSGVO)
          </li>
          <li>Widerspruch gegen die Verarbeitung Ihrer Daten bei uns (Art. 21 DSGVO)</li>
          <li>
            Datenübertragbarkeit, sofern Sie in die Datenverarbeitung eingewilligt haben oder einen
            Vertrag mit uns abgeschlossen haben (Art. 20 DSGVO)
          </li>
        </ul>

        <p className="text-sm text-muted-foreground mt-8">
          Stand: Dezember 2024
        </p>
      </div>
    </div>
  )
}
