class StateHandler {
  data: any;

  constructor(data: any) {
    this.data = data;
  }
  push(data: any, field: string) {
    switch (field) {
      case 'labels':
        return FormDataState['fields']['labels'].push(data);
      case 'input':
        return FormDataState['fields']['input'].push(data);
      case 'select':
        return FormDataState['fields']['select'].push(data);
      case 'select-n-options':
        return FormDataState['fields']['select'][0]['options'].push();
      case 'textarea':
        return FormDataState['fields']['textarea'].push(data);
    }
  }
}

const FormDataState = {
  fields: {
    labels: [
      {
        orderIdentifier: 1,
        label: 'Product title',
        htmlFor: 'title',
      },
      {
        orderIdentifier: 3,
        label: 'Product image',
        htmlFor: 'image',
      },
      {
        orderIdentifier: 5,
        label: 'Product Price',
        htmlFor: 'price',
      },
      {
        orderIdentifier: 7,
        label: 'Product Category',
        htmlFor: 'category',
      },
      {
        orderIdentifier: 9,
        label: 'Product Description',
        htmlFor: 'description',
      },
    ],
    textarea: [
      {
        orderIdentifier: 10,
        name: 'description',
        id: 'description',
        placeholder: 'Product description',
        form: 'create-product',
        rows: 8,
        cols: 48,
      },
    ],
    select: [
      {
        orderIdentifier: 8,
        form: 'create-product',
        name: 'category',
        id: 'category',
        options: [],
      },
    ],
    input: [
      {
        orderIdentifier: 2,
        type: 'text',
        name: 'title',
        placeholder: 'Product title',
        required: true,
        title: 'You must specify a title',
      },
      {
        orderIdentifier: 4,
        type: 'file',
        name: 'image',
        id: 'image',
        title: 'Pick an image',
      },
      {
        orderIdentifier: 6,
        type: 'number',
        name: 'price',
        id: 'price',
        placeholder: 'Product Price',
        title: 'Specify a price',
        required: true,
      },
    ],
  },
};

export default FormDataState;
