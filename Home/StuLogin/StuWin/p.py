import sys
x = '10'
print(sys.getsizeof(x))
print(x.__sizeof__())

# Pure function returns same value on same arguments value
# why variable stores 28 bytes in variable