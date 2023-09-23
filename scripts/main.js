input = document.querySelector("input")
output = document.querySelector(".result")

document.querySelector("#btn").addEventListener("click", function() {
    poly = input.value.trim()
    let extracted = extract(poly)
    console.log(extracted);
    let tab = document.querySelector(".tab")
    tab.innerHTML = `<tr>
    <td>Coefficient</td>
    <td>Degree</td>
</tr>`
    for (let i = 0; i < extracted.length; i++) {
        let className = ""
        if (extracted[i].valeur == 0) {
            className = "class='gray'"
        } 
        document.querySelector("tbody").innerHTML +=
        `<tr ${className}>
            <td>${extracted[i].valeur}</td>
            <td>${extracted[i].degree}</td>
        </tr>`
    }


    let res = ""
    for (let i = 0; i < extracted.length; i++) {
        let s = ""
        if (extracted[i].valeur > 0) {
            s = "+"
        }
        console.log(extracted[i].valeur);
        if (extracted[i].valeur !== 0) {
            res = res + s + `${extracted[i].valeur}x^{${extracted[i].degree}}`

        }
    }
    output.innerHTML = `\\(${res}\\)`
    MathJax.startup.promise.then(() => {
        MathJax.typesetClear([output]);
        MathJax.typeset([output]);
    })


})


function extract(polynome) {
    let extracted_values = [];
    while (polynome.length > 0) {
        let plus_position = polynome.slice(1).indexOf("+");
        let minus_position = polynome.slice(1).indexOf("-");
        
        let is_last_term = plus_position === -1 && minus_position === -1;
        let only_minus_exists = plus_position === -1 && minus_position !== -1;
        let only_plus_exists = plus_position !== -1 && minus_position === -1;
        let plus_position_first = plus_position < minus_position;

        let signe_index;
        if (is_last_term) {
            signe_index = polynome.length;
        } else if (only_minus_exists) {
            signe_index = minus_position + 1;
        } else if (only_plus_exists) {
            signe_index = plus_position + 1;
        } else {
            signe_index = plus_position_first ? plus_position + 1 : minus_position + 1;
        }

        let term = polynome.slice(0, signe_index);
        polynome = polynome.slice(signe_index);

        let x_exists = term.includes("x");

        if (!x_exists) {
            let term_object = { valeur: parseInt(term), degree: 0 };
            extracted_values.push(term_object);
        }

        let signe = 1;
        if (term[0] === "-") {
            signe = -1;
            term = term.slice(1);
        }
        if (term[0] === "+") {
            term = term.slice(1);
        }

        let x_position = term.indexOf("x");
        let exponent_exists = term.includes("^");

        if (x_exists && !exponent_exists) {
            let value = x_position !== 0 ? parseInt(term.slice(0, x_position)) : 1;
            let term_object = { valeur: value * signe, degree: 1 };
            extracted_values.push(term_object);
        }

        let exponent_position = term.indexOf("^");

        if (exponent_exists) {
            let degree = parseInt(term.slice(exponent_position + 1));
            let value = x_position !== 0 ? parseInt(term.slice(0, x_position)) : 1;
            let term_object = { valeur: value * signe, degree: degree };
            extracted_values.push(term_object);
        }
    }

    let valide = true;
    let length = extracted_values.length;

    while (valide) {
        let i = -1;
        while (i < length - 1) {
            i = i + 1;
            valide = false;
            let j = i + 1;

            while (j < length) {
                if (extracted_values[i].degree === extracted_values[j].degree) {
                    extracted_values[i].valeur = extracted_values[i].valeur + extracted_values[j].valeur;
                    valide = true;
                    extracted_values.splice(j, 1);
                    j = j - 1;
                    length = length - 1;
                }

                j = j + 1;
            }
        }
    }

    return extracted_values;
}
