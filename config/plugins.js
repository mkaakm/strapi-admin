module.exports = ({ env }) => {
  return {
    "location-field": {
      enabled: true,
      config: {
        fields: ["photo", "rating"], // optional
        // You need to enable "Autocomplete API" and "Places API" in your Google Cloud Console
        googleMapsApiKey: env("GOOGLE_MAPS_API_KEY"),
        // See https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
        autocompletionRequestOptions: {
          // locationBias: 'IP_BIAS',
        },
      },
    },
    upload: {
      config: {
        breakpoints: {
          xlarge: 2048,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall: 64
        },
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        actionOptions: {
          upload: {},
          uploadStream: {
            folder: env("CLOUDINARY_FOLDER"),
          },
          delete: {},
        },
      },
    },
    // .. your other plugin configurations
  }
};
