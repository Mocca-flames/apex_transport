$c = Get-Content index.html
$first = $c[0..2008]
$insert = @(
'        </div>'
'    </section>'
)
$rest = $c[2089..($c.Length-1)]
$new = $first + $insert + $rest
$new | Set-Content index.html
