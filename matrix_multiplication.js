///<reference path=".\TSDef\p5.global-mode.d.ts" />
function mat_mul(a, b)
{
    let colsA = a[0].length;
    let rowsA = a.length;
    let colsB = b[0].length;
    let rowsB = b.length;
    let sum = 0;
    let rA = 0;
    let cB = 0;
    let cA = 0;

    let result = new Array(rowsA);

    if(colsA == rowsB)
    {
        //Valid arrays
        for(rA = 0; rA < rowsA; rA++)
        {
            result[rA] = new Array(colsB);
            for(cB = 0; cB < colsB; cB++)
            {
                result[rA][cB] = 0;
                for(cA = 0; cA < colsA; cA++)
                {
                    result[rA][cB] += a[rA][cA] * b[cA][cB];
                }
            }
        }
    }

    return result;
}