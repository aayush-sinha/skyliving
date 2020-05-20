function popup() {
    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2']
    }).queue([
        {
            title: 'Name',
            text: 'We will contact on the shared details'
        },
        {
            title: 'Phone',
            text: 'We will contact on the shared details'
        }
    ]).then((result) => {
        if (result.value) {
            console.log(result.value);
            const answers = JSON.stringify(result.value)
            Swal.fire({
                icon: 'success',
                title: 'All done!',
                html: `
              Thank You <strong>${result.value[0]}</strong> for choosing Skylivings
              <p>We will contact you on <strong>${result.value[1]}</strong> or you can give us a call on <a href="tel:123-456-7890">98765431</a></p>
            `,
                confirmButtonText: 'Lovely!'
            })
        }
    })
}