'use strict';
const {PolyUtil} = require("node-geometry-library");
const ejs = require("ejs");
const pdf = require("html-pdf-node");
const path = require("path");
const {readFileSync, createReadStream} = require("fs");
const axios = require("axios");

/**
 * item controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const presentationTemplatePath = path.join(__dirname, "../../../views/presentation.ejs");
const presentationTemplate = readFileSync(presentationTemplatePath).toString();

const calcCount = value => value.replace(/^\D+/g, '');

module.exports = createCoreController('api::item.item', ({strapi})=> ({
  containsLocation: async(ctx)=> {
    const entry = await strapi.db.query("api::item.item").findMany();
    const {body: polygons} = ctx.request;
    const result = entry.filter(({Address}) => {
      const {lat, lng} = Address;

      const response =  polygons.find(polygon => {
        const isContainInPolygon = PolyUtil.containsLocation(
          {lat, lng}, // point object {lat, lng}
          polygon
        );
        return isContainInPolygon;
      });
      return response;
    })
    return result;
  },

  getPresentation: async(ctx) => {
    const {id} = ctx.params;
    const data = await strapi.db.query("api::item.item").findOne({
      where: {
        id,
      },
      populate: ['Photos', "Plan", "Street_View", "Agent"],
    });
    console.log(data);
    const templateData = {
      title: data.Title,
      address: data.Address.description,
      photos: data.Photos.map(({url}) => url),
      plans: data.Plan.map(({url}) => url),
      street_views: data.Street_View.map(({url}) => url),
      square: data.Square,
      bedrooms: calcCount(data.Bedrooms),
      bathrooms: calcCount(data.Bathrooms),
      agent: {
        fullName: data.Agent.FullName,
        description: data.Agent.Description,
        phone: data.Agent.Phone,
        whatsapp: data.Agent.WhatsApp,
      }
    };
    return templateData;
    // const html = ejs.render(presentationTemplate, {templateData, tagline: "Line"});
    //https://pdf-presentation.onrender.com
    // const pdfBuffer = await pdf.generatePdf({content: html}, { format: 'A4', landscape: true});
    // await axios.post("http://localhost:3000/api/presentation", templateData);
    // const options = { format: 'A4', landscape: true };
    // const file = { url: "http://localhost:3000/index.html" };
    // const pdfBuffer = await pdf.generatePdf(file, options);
    // return "<h1>work</h1>";
    // console.log(pdfBuffer)
    // ctx.set('Content-Type', 'application/pdf');
    // ctx.set('Content-disposition', `attachment;filename=presentation.pdf`);
    // return new Buffer(pdfBuffer, 'base64');
    // return html;
    // await pdf.create(html, pdfOptions).toFile(presentationPdfPath, (err, data) => {
    //   const readStream = createReadStream(data.filename);
    //   ctx.set('Content-Type', 'application/pdf')
    //   ctx.set('Content-disposition', `attachment;filename=presentation.pdf`);
    //   readStream.pipe(ctx);
    // });
    // ;

    //
    // return html;
  }
}));
