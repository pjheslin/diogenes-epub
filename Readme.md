# Diogenes to epub for e-readers

diogenes-epub is a package that takes XML files of Latin or Greek texts exported from the Diogenes desktop application and converts them to xhtml files suitable for conversion to epub format, by using code from the DiogenesWeb project.

# Prerequsites

- Node.js
- Calibre (which provides the command-line tool ebook-convert)

# Usage

Install the package and download dependencies:

```
git clone https://github.com/pjheslin/diogenes-epub.git
cd diogenes-epub
npm install
```

To convert an XML file (change the path to suit) to HTML and then to epub:

```
node xml2epub.js ~/Diogenes-Resources/xml/phi/phi0690001.xml
cd output
ebook-convert phi0690001.html eclogues.epub
```

If you are on a Mac, you should change that last line to something like:
```
/Applications/calibre.app/Contents/MacOS/ebook-convert phi0690001.html eclogues.epub
```

You can then open the file eclogues.epub in an e-reader, or use Calibre
